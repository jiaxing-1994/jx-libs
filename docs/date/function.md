# 方法

## clone
用当前实例对配置参数克隆生成一个新的实例
````js
date().clone()
````
接收一个参数，可以修改克隆对初始时间值。

## unix
返回时间戳(秒)
````js
date().unix()
````

## set
按照参数返回一个克隆的新实例
````js
date().set('year', 1)
````

## format
格式化时间
````js
date().format('YYYY-MM-DD HH:mm:ss')
````

## add/subtract
将日期增加/减少一段时间
````js
date().add(1, 'year')
date().add(-1, 'month')
date().subtract(-1, 'month')
````

## isBefore
比较是否在参数日期前
````js
date().isBefore(date('2022-11-01')) // true
date().isBefore('2021-11-01') // false
````

## isAfter
比较是否在参数日期后
````js
date().isAfter(date('2022-11-01')) // false
date().isAfter('2021-11-01') // true
date().isAfter('2021-11-01') // true
````

## isSame
比较是否跟参数日期一致
````js
date().isSame(date('2022-11-01')) // false
date().isSame('2021-11-01') // false
````

## diff
比较两个时间差值并返回，可选单位，默认返回毫秒
````js
date().diff(date('2022-11-01'))
date().diff('2021-11-01', 'year')
````

## diffForStr
比较两个时间差值并将其转为xx年xx月xx天等，可选单位，默认返回到秒
````js
date().diffForStr(date('2022-11-01'))
date().diffForStr('2021-11-01', 'year')
````

