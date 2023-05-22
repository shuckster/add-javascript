# `loadBehavior` option visualised

<- [[ Back to add-javascript README ](./README.md)]

```js
import { addScript, loadScript, makeHook } from "add-javascript";

addScript("https://www.example.com/script.js", {
  loadBehavior: "async" // or "defer" or "blocking"
});

await loadScript("https://www.example.com/script.js", {
  loadBehavior: "async" // or "defer" or "blocking"
});

const useScript = makeHook(React);
function Component() {
  useScript("https://www.example.com/script.js", {
    loadBehavior: "async" // or "defer" or "blocking"
  });
}
```

If the diagrams below aren't being rendered, view this page on [Github](https://github.com/shuckster/add-javascript/blob/master/LOADVIZ.md).

```mermaid
---
displayMode: compact
---

gantt
title "blocking"
dateFormat  YYYY-MM-DD
axisFormat .

section Parsing
HTML parsing       :crit, a1, 2023-05-01, 2023-05-02
HTML parsing paused:after a1, 2023-05-02, 2023-05-04
HTML parsing       :crit, after a2, 2023-05-04, 2023-05-06

section Download
Script download    :active, after a1, 2023-05-02, 2023-05-03

section Execution
Script execution   :crit, active, after a3, 2023-05-03, 2023-05-04
```

```mermaid
---
displayMode: compact
---

gantt
title "async"
dateFormat  YYYY-MM-DD
axisFormat .

section Parsing
HTML parsing       :crit, a1, 2023-05-01, 2023-05-03
HTML parsing paused:after a3, 2023-05-03, 2023-05-04
HTML parsing       :crit, after a2, 2023-05-04, 2023-05-05

section Download
Script download    :active, after a1, 2023-05-02, 2023-05-03

section Execution
Script execution   :crit, active, after a3, 2023-05-03, 2023-05-04
```

```mermaid
---
displayMode: compact
---

gantt
title "defer"
dateFormat  YYYY-MM-DD
axisFormat .

section Parsing
HTML parsing       :crit, a1, 2023-05-01, 2023-05-04

section Download
Script download    :active, a2, 2023-05-02, 2023-05-03

section Execution
Script execution   :crit, active, after a1, 2023-05-04, 2023-05-05
```

Props to [growingwiththeweb.com](https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html) for the original visualisation and [BBSS](https://www.bbss.dev/posts/eventloop/) for the inspiration to use Mermaid Gantt charts to represent them.
