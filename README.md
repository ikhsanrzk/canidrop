canidrop
========

Tool to detect browser versions you should support


```
  Usage
    $ canidrop <website> [<threshold> = 0.01]

  Options
    <website>    address of a website with Yandex.Metrica counters on it
    <threshold>  percent of visiters below this threshold can be considered negligible

  Example
    $ canidrop example.com 0.01

    Firefox 50 3.41%
    Google Chrome 55 15.28%, 36 1.96%, 35 1.31%, 49 1.29%
    Яндекс.Браузер 16.11 10.61%
```

