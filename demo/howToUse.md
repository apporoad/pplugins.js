# easy use

1.  npm i -g    or  npm i -g pplugins.js
2. cd pplugins.js
3. pp init demo/pluginExample/p1.js
4. pp init demo/pluginExample/p2.js
5. pp use
6. pp assignDefault p1
7. node demo/invokerExample/index.js
8. pp assignDefault p2
9. node demo/invokerExample/index.js
10. pp clear

# diff types 
1. pp init demo/pluginExample  // set p1 p2 same module [test],different type [t1] [t2]
2. pp use
3. pp assignDefault test t1
4. node demo/invokerExample/index.js
5. pp assignDefault test t2
6. node demo/invokerExample/index.js