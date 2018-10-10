股票分析爬蟲
===

這是一個股票分析爬蟲，目前支援指令模式

```bash
npm start -h
```
或者
先編譯再執行

```bash
npm build
lib/index.js -h
```

可以獲得指令說明

功能
---

## 爬取資料

Example 
```
    patch -d 1997/8/18
```

## 爬取範圍資料

Example
```
    batch-patch -f 2018/5/20 -t 2018/5/25
```

## 爬取範圍資料匯入至資料庫

    --source 設定來源, 不設定則為 stockq 國際股市
    --no 非國際股市可設定股票代號抓取特定股票
    --from 開始時間
    --to 結束時間
    --database 儲存至 DB
    --all 抓取所有公司, 則不需 stockNo 選項(source 為 twse)


設定 config.js

Example
```
    batch-patch -f 2018/5/20 -t 2018/5/25 --database
```

### 每日早上九點定期爬取資料

    --source 目前只有 twse
    --stockNo 股票代號

Example
```
    schedule-patch --source twse --stockNo 2330
```

### 每日九點爬取所有公司(從 DB 撈取)股市資料

--source 來源, 目前只有 twse 不使用則為 stockq

Example
```
    schedule-patch-all --source twse
```