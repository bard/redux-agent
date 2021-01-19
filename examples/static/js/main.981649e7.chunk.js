(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{305:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(17),o=n.n(c),i=n(32),s=(n(85),n(341)),l=n(335),u=n(342),d=n(343),E=n(86).default,m=n(87).default,p=n(88).default,b=n(89).default,O=n(4),T={intent:Object(O.createStandardAction)("FETCH_TODO")(),success:Object(O.createStandardAction)("FETCH_TODO_SUCCESS")(),failure:Object(O.createStandardAction)("FETCH_TODO_FAILURE")()},g=Object(O.createStandardAction)("START_TIMER")(),f=(Object(O.createStandardAction)("STOP_TIMER")(),Object(O.createStandardAction)("STOP_ALL_TIMERS")()),S=Object(O.createStandardAction)("TIMER_TICK")(),y={intent:Object(O.createStandardAction)("RANDOM_NUMBER")(),result:Object(O.createStandardAction)("RANDOM_NUMBER_RESULT")()},j=Object(O.createStandardAction)("CONNECT_WEB_SOCKET")(),C=Object(O.createStandardAction)("SUBSCRIBE_TO_CURRENCY_INFO")(),v=Object(O.createStandardAction)("DISCONNECT_WEB_SOCKET")(),h={connected:Object(O.createStandardAction)("SOCKET_CONNECTED")(),disconnected:Object(O.createStandardAction)("SOCKET_DISCONNECTED")(),messageReceived:Object(O.createStandardAction)("SOCKET_MESSAGE_RECEIVED")(),error:Object(O.createStandardAction)("SOCKET_ERROR")(),messageSent:Object(O.createStandardAction)("SOCKET_MESSAGE_SENT")()},R=(Object(O.createStandardAction)("RESET")(),n(20)),k=n(59),_=n(68),N=n(67),A=n(60),U=n(346),w=n(62),D=n(63),I=n(336),M=n(334),B=n(345),x=n(69),K=n(338),F=n(344),W=n(337),L=function(e){var t=e.children;return r.a.createElement(d.a,{textAlign:"center",mt:2},r.a.createElement(x.a,{variant:"caption",component:"em"},t))},G=function(e){var t=e.language,n=e.children,a="javascript"===t?w.a:D.a;return r.a.createElement(U.a,{language:t,style:a,customStyle:{fontSize:"0.85rem",lineHeight:1.4,padding:"0.5rem",border:"1px solid #eee"}},n)},H=function(e,t){var n;if(t&&t.agentStateVisible)n=e;else{e.tasks;var a=Object(_.a)(e,["tasks"]);n=a}var r={};return Object.keys(n).forEach(function(e){r[e]=n[e]}),r},V=function(e){return JSON.stringify(e,null,2)},X=function(e){var t=e.source,n=e.actions,c=e.title,o=e.state,i=e.description,s=e.referenceUrl,u=Object(a.useState)(0),E=Object(R.a)(u,2),m=E[0],p=E[1],b=Object(a.useState)(-1),O=Object(R.a)(b,2),T=O[0],g=O[1],f=Object(a.useState)([]),S=Object(R.a)(f,2),y=S[0],j=S[1],C=Object(a.useState)(!1),v=Object(R.a)(C,2),h=v[0],k=v[1],_=Object(a.useState)(!1),U=Object(R.a)(_,2),w=U[0],D=U[1];Date.now()-T<3e3&&o!==y[y.length-1]&&j(function(e){return[].concat(Object(N.a)(e),[o])});var X=r.a.createElement(M.a,{control:r.a.createElement(B.a,{checked:w,onChange:function(e){return D(e.currentTarget.checked)}}),label:"Show state slice managed by/reserved to agent"});return r.a.createElement(d.a,null,r.a.createElement(d.a,{textAlign:"left",mb:2},r.a.createElement(x.a,{variant:"h4",color:"textSecondary",style:{fontWeight:300},gutterBottom:!0},c),r.a.createElement(x.a,{variant:"body2"},i)),r.a.createElement("hr",null),r.a.createElement(l.a,{container:!0,spacing:2},r.a.createElement(l.a,{item:!0,xs:12,sm:6},r.a.createElement(L,null,"Reducer"),r.a.createElement(G,{language:"javascript"},t),r.a.createElement(x.a,{variant:"body2",component:"p"},"Find out more about available tasks in the ",r.a.createElement(I.a,{href:s},"agent reference"),".")),r.a.createElement(l.a,{item:!0,xs:12,sm:6},r.a.createElement(L,null,"Actions"),r.a.createElement(d.a,{pt:1,onClick:function(){k(!1),g(Date.now()),j([o])}},n),r.a.createElement(x.a,{variant:"body2"},r.a.createElement("em",null,"Tip: open the browser console to see actions as they are dispatched.")),r.a.createElement(L,null,"State"),r.a.createElement(F.a,{variant:"fullWidth",value:m,onChange:function(e,t){p(t)}},r.a.createElement(W.a,{label:"Live"}),r.a.createElement(W.a,{onClick:function(){return k(!0)},label:y.length>0&&!h?r.a.createElement(K.a,{badgeContent:y.length,color:"secondary"},"Log"):"History"})),0===m&&r.a.createElement(r.a.Fragment,null,X,r.a.createElement(G,{language:"json"},V(H(o,{agentStateVisible:w})))),1===m&&y.length>0&&r.a.createElement(r.a.Fragment,null,X,y.map(function(e,t){return 0===t?r.a.createElement(G,{key:t,language:"json"},V(H(e,{agentStateVisible:w}))):r.a.createElement(G,{key:t,language:"diff"},Object(A.diffString)(H(y[t-1],{agentStateVisible:w}),H(e,{agentStateVisible:w}),{color:!1}))}),r.a.createElement(G,{key:y.length,language:"json"},V(H(y.slice().pop(),{agentStateVisible:w})))))))},P=n(65),J=n(306),Y=Object(J.a)(function(e){return{root:Object(P.a)({marginBottom:e.spacing(4),position:"sticky",top:e.spacing(8),paddingRight:e.spacing(1)},e.breakpoints.down("md"),{position:"static"}),header:{fontWeight:"bold",marginBottom:e.spacing(1)},list:{padding:0,margin:0,listStyleType:"none","& > li":{marginBottom:e.spacing(1)},"& > li > ul":{paddingLeft:e.spacing(1)}},back:{"&:before":{content:'"\u2190"',display:"inline-block",position:"absolute",left:"-1rem"}}}}),q=function(e){var t=e.sections,n=e.current,a=Y();return r.a.createElement("nav",{className:a.root},r.a.createElement(x.a,{variant:"body2",component:"ul",className:a.list},r.a.createElement("li",{className:a.back},r.a.createElement(I.a,{href:"/",color:"inherit"},"Back to Docs")),r.a.createElement("li",null,"Examples"),r.a.createElement("li",null,r.a.createElement(x.a,{variant:"body2",component:"ul",className:a.list},Object.entries(t).map(function(e){var t=Object(R.a)(e,2),a=t[0],c=t[1];return r.a.createElement("li",{key:a},r.a.createElement(I.a,{href:a,color:a===n?"primary":"inherit"},c))})))))},z=n(339),$=function(e){var t=e.label,n=e.onClick,a=e.disabled;return r.a.createElement(z.a,{onClick:n,style:{marginTop:"0.5rem"},disabled:a,variant:"contained",color:"primary",fullWidth:!0},t)},Q=n(347),Z=n(340),ee=function(){return r.a.createElement(Q.a,{position:"fixed",color:"primary"},r.a.createElement(Z.a,{variant:"dense"},r.a.createElement(d.a,{ml:2,mr:3},r.a.createElement("img",{src:"https://redux-agent.org/images/logo.svg",width:24,height:24,alt:"Redux Agent"})),r.a.createElement(x.a,{variant:"body1",style:{fontWeight:400},color:"inherit"},r.a.createElement(I.a,{href:"/",color:"inherit"},"Redux Agent"))))},te={"#http":"HTTP Requests","#rng":"Random Number Generation","#timer":"Timers","#socket":"WebSocket Messaging"},ne=function(){var e=Object(i.b)(),t=Object(i.c)(function(e){return e}),n=Object(i.c)(function(e){return e.liveCurrencyUpdates.active}),c=function(){var e=Object(a.useState)(null),t=Object(R.a)(e,2),n=t[0],r=t[1];return Object(k.a)("hashchange",function(e){r(e.target.location.hash)}),n||window.location.hash}();Object(a.useEffect)(function(){window.scrollTo(0,0)},[c]);var o=Object.keys(te).includes(c)?c:"#http";return r.a.createElement("div",null,r.a.createElement(s.a,null),r.a.createElement(ee,null),r.a.createElement(u.a,{maxWidth:"lg"},r.a.createElement(d.a,{mt:12}),r.a.createElement(l.a,{container:!0},r.a.createElement(l.a,{item:!0,md:2},r.a.createElement(q,{current:o,sections:te})),r.a.createElement(l.a,{item:!0,md:10,lg:9},"#http"===o&&r.a.createElement(X,{title:"Example: HTTP Request",description:"Goal: Fetch a to-do item from a REST API.",actions:r.a.createElement($,{label:"FETCH TODO",onClick:function(){return e(T.intent())}}),state:t,source:E,referenceUrl:"/reference/http/"}),"#timer"===o&&r.a.createElement(X,{title:"Example: Timer",description:"Goal: Receive an action every 500ms.",actions:r.a.createElement(r.a.Fragment,null,r.a.createElement($,{label:"START TIMER",onClick:function(){return e(g())}}),r.a.createElement($,{label:"STOP ALL TIMERS",onClick:function(){return e(f())}})),state:t,source:m,referenceUrl:"/reference/timer/"}),"#rng"===o&&r.a.createElement(X,{title:"Example: Random Number Generation",description:"Goal: Generate a random number.",actions:r.a.createElement($,{label:"GENERATE RANDOM NUMBER",onClick:function(){return e(y.intent())}}),state:t,source:p,referenceUrl:"/reference/random-number-generator/"}),"#socket"===o&&r.a.createElement(X,{title:"Example: WebSocket",description:"Goal: Receive live currency updates.",actions:r.a.createElement(r.a.Fragment,null,r.a.createElement($,{label:"CONNECT WEB SOCKET",onClick:function(){return e(j())},disabled:n}),r.a.createElement($,{label:"SUBSCRIBE TO CURRENCY INFO",onClick:function(){return e(C())},disabled:!n}),r.a.createElement($,{label:"DISCONNECT WEB SOCKET",onClick:function(){return e(v())},disabled:!n})),state:t,source:b,referenceUrl:"/reference/websocket/"}))),r.a.createElement(d.a,{mb:4})))},ae=function(){return r.a.createElement(ne,null)};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var re=n(26),ce=n(66),oe=(n(303),n(10)),ie=n(22),se=function(e,t){return Object(ie.default)(e,function(e){switch(t.type){case Object(O.getType)(T.intent):return void Object(oe.a)(e,{type:"http",method:"get",url:"https://jsonplaceholder.typicode.com/todos/1",actions:{success:Object(O.getType)(T.success),failure:Object(O.getType)(T.failure)}});case Object(O.getType)(T.success):return void(e.httpTodoItem=t.payload)}})},le=function(e,t){return Object(ie.default)(e,function(e){switch(t.type){case Object(O.getType)(g):return void Object(oe.a)(e,{type:"timer",interval:500,actions:{tick:Object(O.getType)(S)}});case Object(O.getType)(S):return void(e.timerCounter+=1);case Object(O.getType)(f):return void Object(oe.h)(e,function(e){return"timer"===e.type})}})},ue=function(e,t){return Object(ie.default)(e,function(e){switch(t.type){case Object(O.getType)(y.intent):return void Object(oe.a)(e,{type:"rng",actions:{result:Object(O.getType)(y.result)}});case Object(O.getType)(y.result):return void(e.randomNumber=t.payload)}})},de=function(e,t){return Object(ie.default)(e,function(e){switch(t.type){case Object(O.getType)(j):return void Object(oe.a)(e,{type:"socket",op:"listen",url:"wss://ws-beta.kraken.com/",actions:{connect:Object(O.getType)(h.connected),disconnect:Object(O.getType)(h.disconnected),error:Object(O.getType)(h.error),message:Object(O.getType)(h.messageReceived)}});case Object(O.getType)(C):return void Object(oe.a)(e,{type:"socket",op:"send",data:{event:"subscribe",pair:["XBT/USD","XBT/EUR"],subscription:{name:"ticker"}},actions:{sent:Object(O.getType)(h.messageSent)}});case Object(O.getType)(v):return void Object(oe.h)(e,function(e){return"socket"===e.type});case Object(O.getType)(h.disconnected):return void(e.liveCurrencyUpdates.active=!1);case Object(O.getType)(h.connected):return void(e.liveCurrencyUpdates.active=!0);case Object(O.getType)(h.messageReceived):return 4===e.liveCurrencyUpdates.events.length&&e.liveCurrencyUpdates.events.pop(),void e.liveCurrencyUpdates.events.unshift(t.payload)}})},Ee=Object(oe.i)({httpTodoItem:null,timerCounter:0,randomNumber:null,liveCurrencyUpdates:{active:!1,events:[]}},se,le,ue,de,oe.j),me=(n(304),function(e){var t=[];var n="__REDUX_DEVTOOLS_EXTENSION__"in window?Object(ce.composeWithDevTools)(re.applyMiddleware.apply(void 0,t)):re.applyMiddleware.apply(void 0,t),a=Object(re.createStore)(Ee,e,n);return a.subscribe(Object(oe.b)([Object(oe.c)(),Object(oe.f)(),Object(oe.e)(),Object(oe.g)(),Object(oe.d)()],a)),a}());o.a.render(r.a.createElement(i.a,{store:me},r.a.createElement(ae,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},76:function(e,t,n){e.exports=n(305)},85:function(e,t,n){},86:function(e,t,n){"use strict";n.r(t),t.default="import {\n  addTask, reduceReducers, taskReducer\n} from 'redux-agent'\n\nconst reducer = (state, action) => {\n  switch (action.type) {\n    case 'FETCH_TODO':\n      return addTask(state, {\n        type: 'http',\n        method: 'get',\n        url: 'https://jsonplaceholder.typicode.com/todos/1',\n        actions: {\n          success: 'FETCH_TODO_SUCCESS',\n          failure: 'FETCH_TODO_FAILURE'\n        }\n      })\n\n    case 'FETCH_TODO_SUCCESS':\n      return {\n        ...state,\n        httpTodoItem: action.payload\n      }\n\n    default:\n      return state\n  }\n}\n\nexport default reduceReducers(reducer, taskReducer)\n"},87:function(e,t,n){"use strict";n.r(t),t.default="import {\n  addTask, delTasks, reduceReducers, taskReducer\n} from 'redux-agent'\n\nconst reducer = (state, action) => {\n  switch (action.type) {\n    case 'START_TIMER':\n      return addTask(state, {\n        type: 'timer',\n        interval: 500,\n        actions: {\n          tick: 'TICK'\n        }\n      })\n\n    case 'TICK':\n      return {\n        ...state,\n        counter: state.counter + 1\n      }\n\n    case 'STOP_ALL_TIMERS':\n      return delTasks(state,\n        (t) => t.type === 'timer')\n\n    default:\n      return state\n  }\n}\n\nexport default reduceReducers(reducer, taskReducer)\n"},88:function(e,t,n){"use strict";n.r(t),t.default="import {\n  addTask, reduceReducers, taskReducer\n} from 'redux-agent'\n\nconst reducer = (state, action) => {\n  switch (action.type) {\n    case 'RANDOM_NUMBER':\n      return addTask(state, {\n        type: 'rng',\n        actions: {\n          result: 'RANDOM_NUMBER_RESULT'\n        }\n      })\n\n    case 'RANDOM_NUMBER_RESULT':\n      return {\n        ...state,\n        randomNumber: action.payload\n      }\n\n    default:\n      return state\n  }\n}\n\nexport default reduceReducers(reducer, taskReducer)\n"},89:function(e,t,n){"use strict";n.r(t),t.default="import {\n  addTask, delTasks, reduceReducers, taskReducer\n} from 'redux-agent'\n\nconst MAX_EVENTS = 4\n\nconst reducer = (state, action) => {\n  switch (action.type) {\n    case 'CONNECT_WEB_SOCKET':\n      return addTask(state, {\n        type: 'socket',\n        op: 'listen',\n        url: 'wss://ws-beta.kraken.com/',\n        actions: {\n          connect: 'SOCKET_CONNECTED',\n          disconnect: 'SOCKET_DISCONNECTED',\n          error: 'SOCKET_ERROR',\n          message: 'SOCKET_MESSAGE_RECEIVED'\n        }\n      })\n\n    case 'SUBSCRIBE_TO_CURRENCY_INFO':\n      return addTask(state, {\n        type: 'socket',\n        op: 'send',\n        data: {\n          event: 'subscribe',\n          pair: ['XBT/USD', 'XBT/EUR'],\n          subscription: { name: 'ticker' }\n        },\n        actions: {\n          sent: 'SOCKET_MESSAGE_SENT'\n        }\n      })\n\n    case 'DISCONNECT_WEB_SOCKET':\n      return delTasks(state,\n        (t) => t.type === 'socket')\n\n    case 'SOCKET_MESSAGE_RECEIVED':\n      const { events } = state.liveCurrencyUpdates\n      return {\n        ...state,\n        liveCurrencyUpdates: {\n          ...state.liveCurrencyUpdates,\n          events: events.length < MAX_EVENTS\n            ? events.concat(action.payload)\n            : events.slice(0, -1).concat(action.payload)\n        }\n      }\n\n    default:\n      return state\n  }\n}\n\nexport default reduceReducers(reducer, taskReducer)\n"}},[[76,1,2]]]);
//# sourceMappingURL=main.981649e7.chunk.js.map