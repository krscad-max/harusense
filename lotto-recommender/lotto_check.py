#!/usr/bin/env python3
import os,sys,datetime,json,requests,re
from pathlib import Path

CONFIG=Path(__file__).parent/'config.json'
if CONFIG.exists():
    cfg=json.loads(CONFIG.read_text())
else:
    cfg={}
HISTORY=cfg.get('history_path',str(Path(__file__).parent/'history.csv'))

# Simple fetcher: tries a list of candidate URLs (can be extended).
# For robustness, if remote fetch fails, the script exits quietly.

def fetch_lotto_results(lotto_name):
    try:
        if 'Max' in lotto_name:
            url = 'https://www.magayo.com/lotto/canada/lotto-max-results/'
            want = 7
        else:
            url = 'https://www.magayo.com/lotto/canada/lotto-649-results/'
            want = 6
        import requests, re
        r = requests.get(url, headers={'User-Agent':'Mozilla/5.0'}, timeout=10)
        txt = r.text
        text_only = re.sub(r'<[^>]+>',' ', txt)
        text_only = re.sub(r'\s+',' ', text_only)
        pattern = r'((?:\b\d{1,2}\b\D{0,10}){'+str(want)+'})'
        m = re.search(pattern, text_only)
        if m:
            nums = [int(n) for n in re.findall(r"\b(\d{1,2})\b", m.group(1))]
            seen = []
            for n in nums:
                if n not in seen:
                    seen.append(n)
                if len(seen) >= want:
                    break
            return seen[:want]
        # fallback: any run
        runs = re.findall(r'(?:\b\d{1,2}\b[\s\u00A0,.-]{0,6}){'+str(want)+',}', text_only)
        for run in runs:
            nums = [int(n) for n in re.findall(r"\b(\d{1,2})\b", run)]
            seen=[]
            for n in nums:
                if n not in seen:
                    seen.append(n)
                if len(seen) >= want:
                    break
            if len(seen) >= want:
                return seen[:want]
    except Exception:
        return None
    return None



def compare_and_notify(lotto_name, winning_numbers):
    # Load history and find last recommendation for same lotto
    path=Path(HISTORY)
    last_rec=None
    if path.exists():
        with path.open('r',encoding='utf-8') as f:
            lines=[l.strip() for l in f if l.strip()]
        # parse last line matching lotto_name
        for line in reversed(lines):
            parts=line.split('\t')
            if len(parts)>=3 and parts[1]==lotto_name:
                # parts: ts, lotto, picks, reasons...
                picks=parts[2].split(',')
                picks=[int(x) for x in picks if x]
                last_rec={'ts':parts[0],'picks':picks}
                break
    matches=[]
    if last_rec and winning_numbers:
        matches=[n for n in last_rec['picks'] if n in winning_numbers]
    # record result
    ts=datetime.datetime.now().isoformat()
    record=[ts, lotto_name, ','.join(map(str,last_rec['picks'])) if last_rec else '', ','.join(map(str,winning_numbers)) if winning_numbers else '', str(len(matches)), ','.join(map(str,matches))]
    path.parent.mkdir(parents=True,exist_ok=True)
    with path.open('a',encoding='utf-8') as f:
        f.write('\t'.join(record)+"\n")
    # notify via telegram if env set
    token=os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id=os.environ.get('TELEGRAM_CHAT_ID')
    msg=f"[{lotto_name}] 결과 확인: {','.join(map(str,winning_numbers)) if winning_numbers else '조회 실패'}\n"
    if last_rec:
        msg+=f"추천(마지막): {','.join(map(str,last_rec['picks']))}\n"
        msg+=f"맞춘 개수: {len(matches)}; 일치: {','.join(map(str,matches)) if matches else '없음'}\n"
    if token and chat_id:
        try:
            requests.post(f'https://api.telegram.org/bot{token}/sendMessage', data={'chat_id':chat_id,'text':msg})
        except Exception:
            pass
    else:
        print(msg)

if __name__=='__main__':
    # run for both lotto types by default
    for entry in [{'name':'Lotto Max','count':7},{'name':'Lotto 6/49','count':6}]:
        res=fetch_lotto_results(entry['name'])
        compare_and_notify(entry['name'], res)
