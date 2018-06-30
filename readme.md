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

設定 config.js

Example
```
    batch-patch -f 2018/5/20 -t 2018/5/25 --database
```