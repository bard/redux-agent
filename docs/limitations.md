# Limitations

Tasks are stored in a top-level member of the Redux state, therefore they can only be managed from reducers that have access to the entire state tree. That rules out reducers included via `combineReducers`. See <a href="https://redux.js.org/recipes/structuring-reducers/beyond-combinereducers" target="_blank">Beyond combineReducers</a> in the official Redux documentation.

Time traveling in Redux devtools is currently not supported but on the roadmap. Tracing and inspection works as usual.


