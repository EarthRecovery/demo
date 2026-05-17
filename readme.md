你需要完成一个可交互的demo, 展现我们做BOM(主要是电子产品开发) optimization 的过程
## 总体布局

左边的侧边栏，用来选择不同功能
右边是功能的主题
顶部或者主页面显示一个进度条， 显示在哪一个步骤


## 功能1 Bom Project dashboard
卡片列表格式
每一个卡片包含：name/BOM status/key metrics/BOM处理到哪一步了

## 功能2 BOM upload
用于上传BOM（还包括多模态的文件，excel/pdf等等辅助文件）, 用户上传以后自动分析，提取所有原件的名称，价格，制造商等等关键信息

做完有一个Clean BOM 的按钮

## 功能三 Clean BOM
列表格式
每一行是一个component 以及其关键信息
AI会自动在这些信息旁边标注评价：是好的？还是有可替代的？还是有风险的？还是不好的？
用户可以直接点开评价查看具体评价

## 功能四 Risk Review
用户在clean BOM 之后，可以使用这个功能来查看产品的所有风险所在，包括
Supply Risk
Long lead-time parts
Low inventory parts
Single-source parts
Supplier concentration risk
Lifecycle Risk
·EOL
NRND
Obsolete
Not recommended for new design
Cost Risk
Top 10 cost drivers
Parts above benchmark price
Cost-saving opportunities
Data Quality Risk

## 功能5 Substitute Recommendation
用户点一个高风险 part，进入 substitute 页面,
页面结构:
Original Part
MPN、manufacturer、description、package、spec.
price、lead time、availability、risk reason
Recommended Alternatives
Substitute Compatibility CostImpact Lead Time Ava
AI不只是列替代料，而是解释 tradeoff

用户可以选择是否接受还是reject

## 功能6 Costed BOM
这张 BOM 到底多少钱?
展示每一个零件以及总体的cost, 还要包括运输，税等等


## 功能7 Production Ready BOM

系统给整个BOM打分
告诉用户还差什么
用户满意后可以选择export BOM

## 功能8： 右侧 AI Insight Panel
有一个聊天栏
需要实时显示AI Summary 的一些关键信息

## 9 偏好设置
针对每一个project 都需要一个偏好设置
你想做demo 还是做产品？你想做的尽量好还是最便宜？

## 10 company memory

比如用户以后上传一张新 BOM，系统会说
This desian uses 12 parts similar to yourprevious Smart Sensor V1 BOM.4 substituteswere previously approved by your engineerincteam.2 parts caused production delays last
time.


