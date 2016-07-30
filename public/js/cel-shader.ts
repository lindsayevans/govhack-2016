// class CelShader {

//   DIFFUSE = vec3.fromValues(1.00, 0.66, 0.00);

//   AMBIENT = vec3.fromValues(0.1, 0.1, 0.1);

//   SPECULAR = vec3.fromValues(0.50, 0.50, 0.50);

//   SHININESS = 100;

//   LIGHT_POSITION = vec3.fromValues(0.25, 0.25, 1);

//   TRANSLATION = vec3.fromValues(0, 0, -3);

//   FIELD_OF_VIEW_DEG = 45;

//   Z_NEAR = 0.01;

//   Z_FAR = 50;

//   SLICES = 192;

//   STACKS = 48;

//   TREFOIL_A = 0.6;

//   TREFOIL_B = 0.3;

//   TREFOIL_C = 0.5;

//   TREFOIL_D = 0.15;

//   CEL_SHADING_LEVEL = 1;

//   OUTLINE_WIDTH = 0.01;

//   OUTLINE_COLOR = vec4.fromValues(0.0, 0.0, 0.0, 1);

//   Epsilon = 0.01;

//   VertexCount = SLICES * STACKS;

//   IndexCount = VertexCount * 6;

//   Tau = 2 * Math.PI;

//   OutlineVertShaderSrc = "precision mediump float;\nattribute vec3 a_position;\nattribute vec3 a_normal;\n\nuniform mat4 u_projectionMat;\nuniform mat4 u_modelviewMat;\nuniform float u_offset;\n\nvoid main() {\n  vec4 p = vec4(a_position+a_normal*u_offset, 1.0);\n  gl_Position = u_projectionMat * u_modelviewMat * p;\n}";

//   OutlineFragShaderSrc = "precision mediump float;\nuniform vec4 u_color;\n\nvoid main() {\n  gl_FragColor = u_color;\n}";

//   CelVertShaderSrc = "precision mediump float;\nattribute vec3 a_position;\nattribute vec3 a_normal;\n\nuniform mat4 u_projectionMat;\nuniform mat4 u_modelviewMat;\nuniform mat3 u_normalMat;\nuniform vec3 u_diffuse;\n\nvarying vec3 v_eyeNormal;\nvarying vec3 v_diffuse;\n\nvoid main() {\n  v_eyeNormal = u_normalMat * a_normal;\n  v_diffuse = u_diffuse;\n  gl_Position = u_projectionMat * u_modelviewMat * vec4(a_position, 1.0);\n}";

//   CelFragShaderSrc = "precision mediump float;\nvarying vec3 v_eyeNormal;\nvarying vec3 v_diffuse;\n\nuniform vec3 u_light;\nuniform vec3 u_ambient;\nuniform vec3 u_specular;\nuniform float u_shine;\nuniform float u_celShading;\n\nfloat celShade(float d) {\n  float E = 0.05;\n  d *= u_celShading;\n  float r = 1.0 / (u_celShading-0.5);\n  float fd = floor(d);\n  float dr = d * r;\n  if (d > fd-E && d < fd+E) {\n    float last = (fd - sign(d - fd))*r;\n    return mix(last, fd*r, \n      smoothstep((fd-E)*r, (fd+E)*r, dr));\n  } else {\n    return fd*r;\n  }\n}\n\nvoid main() {\n  vec3 en = normalize(v_eyeNormal);\n  vec3 ln = normalize(u_light);\n  vec3 hn = normalize(ln + vec3(0, 0, 1));\n  float E = 0.05;\n\n  float df = max(0.0, dot(en, ln));\n  float sf = max(0.0, dot(en, hn));\n\n  float cdf = celShade(df);  \n\n  sf = pow(sf, u_shine);\n\n  if (sf > 0.5 - E && sf < 0.5 + E) {\n    sf = smoothstep(0.5 - E, 0.5 + E, sf);\n  } else {\n    sf = step(0.5, sf);\n  }\n\n  float csf = sf;\n\n  vec3 color = u_ambient + cdf * v_diffuse + csf * u_specular;\n\n\n  gl_FragColor = vec4(color, 1.0);\n}";

//   glEnumToString = function(gl, glenum) {
//     var name, val;
//     for (name in gl) {
//       if (!hasProp.call(gl, name)) continue;
//       val = gl[name];
//       if (val === glenum) {
//         return name;
//       }
//     }
//     return "0x" + (glenum.toString(16));
//   };

//   glCheckAndLogError = function(gl) {
//     var err;
//     err = gl.getError();
//     if (err !== gl.NO_ERROR) {
//       return console.error(glEnumToString(gl, err));
//     }
//   };

//   fatalError = function(canvas, message) {
//     var ctx;
//     ctx = canvas.getContext('2d');
//     ctx.fillStyle = 'black';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = 'red';
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.font = '20px san-serif';
//     ctx.fillText(message, canvas.width / 2, canvas.height / 2);
//     throw new Error(message);
//   };

//   getWebGLContext = function(canvas, glattrs) {
//     var alias, ctx, k, len1, ref;
//     if (glattrs == null) {
//       glattrs = null;
//     }
//     ref = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];
//     for (k = 0, len1 = ref.length; k < len1; k++) {
//       alias = ref[k];
//       try {
//         if (ctx = canvas.getContext(alias, glattrs)) {
//           return ctx;
//         }
//       } catch (_error) {}
//     }
//     return fatalError(canvas, 'WebGL initialization failed (check browser support?)');
//   };

//   trefoil = function(s, t) {
//     var cosu, cosv, cu15, dv, q, qv, r, ref, ref1, ref2, ref3, sinu, sinv, su15, u, v, ww;
//     ref = [(1 - s) * 2 * Tau, t * Tau], u = ref[0], v = ref[1];
//     ref1 = [Math.sin(1.0 * u), Math.cos(1.0 * u)], sinu = ref1[0], cosu = ref1[1];
//     ref2 = [Math.sin(1.0 * v), Math.cos(1.0 * v)], sinv = ref2[0], cosv = ref2[1];
//     ref3 = [Math.sin(1.5 * u), Math.cos(1.5 * u)], su15 = ref3[0], cu15 = ref3[1];
//     r = TREFOIL_A + TREFOIL_B * cu15;
//     dv = [-1.5 * TREFOIL_B * su15 * cosu - r * sinu, -1.5 * TREFOIL_B * su15 * sinu + r * cosu, +1.5 * TREFOIL_C * cu15];
//     q = vec3.normalize(vec3.create(), dv);
//     qv = vec3.normalize(vec3.create(), [q[1], -q[0], 0]);
//     ww = vec3.cross(vec3.create(), q, qv);
//     return [r * cosu + TREFOIL_D * (qv[0] * cosv + (-dv[2] * qv[1]) * sinv), r * sinu + TREFOIL_D * (qv[1] * cosv + (+dv[2] * qv[0]) * sinv), TREFOIL_C * su15 + TREFOIL_D * (dv[0] * qv[1] - dv[1] * qv[0]) * sinv];
//   };

//   VertexBuffer = (function() {
//     function VertexBuffer(gl) {
//       var buf, ds, dt, k, l, n, p, ref, ref1, ref2, ref3, ref4, s, t, u, v, verts;
//       ref = [1.0 / SLICES, 1.0 / STACKS], ds = ref[0], dt = ref[1];
//       buf = [];
//       for (s = k = 0, ref1 = 1 - ds / 2, ref2 = ds; ref2 > 0 ? k < ref1 : k > ref1; s = k += ref2) {
//         for (t = l = 0, ref3 = 1 - dt / 2, ref4 = dt; ref4 > 0 ? l < ref3 : l > ref3; t = l += ref4) {
//           p = trefoil(s, t);
//           u = vec3.sub([], trefoil(s + Epsilon, t), p);
//           v = vec3.sub([], trefoil(s, t + Epsilon), p);
//           n = vec3.cross([], u, v);
//           u = vec3.cross(u, u, v);
//           vec3.normalize(u, u);
//           buf.push(p[0]);
//           buf.push(p[1]);
//           buf.push(p[2]);
//           buf.push(u[0]);
//           buf.push(u[1]);
//           buf.push(u[2]);
//         }
//       }
//       verts = new Float32Array(buf);
//       this.handle = gl.createBuffer();
//       console.assert(this.handle !== null, "gl.createBuffer failed" + glEnumToString(gl, gl.getError()));
//       gl.bindBuffer(gl.ARRAY_BUFFER, this.handle);
//       gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
//     }

//     VertexBuffer.prototype.bind = function(gl) {
//       return gl.bindBuffer(gl.ARRAY_BUFFER, this.handle);
//     };

//     return VertexBuffer;

//   })();

//   IndexBuffer = (function() {
//     function IndexBuffer(gl) {
//       var i, idxs, ii, j, k, l, n, ref, ref1;
//       idxs = new Uint16Array(IndexCount);
//       n = ii = 0;
//       for (i = k = 0, ref = SLICES; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
//         for (j = l = 0, ref1 = STACKS; 0 <= ref1 ? l < ref1 : l > ref1; j = 0 <= ref1 ? ++l : --l) {
//           idxs[ii++] = n + j;
//           idxs[ii++] = n + (j + 1) % STACKS;
//           idxs[ii++] = (n + j + STACKS) % VertexCount;
//           idxs[ii++] = (n + j + STACKS) % VertexCount;
//           idxs[ii++] = (n + (j + 1) % STACKS) % VertexCount;
//           idxs[ii++] = (n + (j + 1) % STACKS + STACKS) % VertexCount;
//         }
//         n += STACKS;
//       }
//       this.handle = gl.createBuffer();
//       console.assert(this.handle !== null, "gl.createBuffer failed");
//       gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.handle);
//       gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idxs, gl.STATIC_DRAW);
//     }

//     IndexBuffer.prototype.bind = function(gl) {
//       return gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.handle);
//     };

//     return IndexBuffer;

//   })();

//   ShaderProgram = (function() {
//     ShaderProgram.prototype.compileShader = function(gl, src, typestr) {
//       var log, shader;
//       shader = gl.createShader(gl[typestr]);
//       console.assert(shader, "createShader failed. type='" + typestr + "'");
//       gl.shaderSource(shader, src.trim());
//       gl.compileShader(shader);
//       if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//         log = gl.getShaderInfoLog(shader);
//         gl.deleteShader(shader);
//         console.error(typestr + " shader info log:\n" + log);
//         fatalError("failed to compile " + typestr);
//       }
//       return shader;
//     };

//     function ShaderProgram(gl, vsrc, fsrc, attribLocs) {
//       var attrib, fs, i, info, k, l, len, loc, log, ref, ref1, vs;
//       fs = this.compileShader(gl, fsrc, 'FRAGMENT_SHADER');
//       vs = this.compileShader(gl, vsrc, 'VERTEX_SHADER');
//       this.program = gl.createProgram();
//       console.assert(!!this.program, "gl.createProgram failed");
//       gl.attachShader(this.program, vs);
//       gl.attachShader(this.program, fs);
//       for (attrib in attribLocs) {
//         if (!hasProp.call(attribLocs, attrib)) continue;
//         loc = attribLocs[attrib];
//         gl.bindAttribLocation(this.program, loc, attrib);
//       }
//       gl.linkProgram(this.program);
//       gl.deleteShader(vs);
//       gl.deleteShader(fs);
//       if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
//         log = gl.getProgramInfoLog(this.program);
//         gl.deleteProgram(this.program);
//         console.error("program info log:\n" + log);
//         fatalError("shader link failed: " + log);
//       }
//       this.uniforms = {};
//       len = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS) || 0;
//       for (i = k = 0, ref = len; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
//         info = gl.getActiveUniform(this.program, i);
//         if (info != null) {
//           this.uniforms[info.name] = gl.getUniformLocation(this.program, info.name);
//         }
//       }
//       this.attributes = {};
//       len = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES) || 0;
//       for (i = l = 0, ref1 = len; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
//         info = gl.getActiveAttrib(this.program, i);
//         if (info != null) {
//           this.attributes[info.name] = gl.getAttribLocation(this.program, info.name);
//         }
//       }
//     }

//     ShaderProgram.prototype.use = function(gl) {
//       return gl.useProgram(this.program);
//     };

//     ShaderProgram.prototype.setUniform1f = function(gl, name, x) {
//       var loc;
//       if ((loc = this.uniforms[name]) != null) {
//         return gl.uniform1f(loc, x);
//       }
//     };

//     ShaderProgram.prototype.setUniform2f = function(gl, name, x, y) {
//       var loc;
//       if ((loc = this.uniforms[name]) != null) {
//         return gl.uniform2f(loc, x, y);
//       }
//     };

//     ShaderProgram.prototype.setUniform3f = function(gl, name, x, y, z) {
//       var loc;
//       if ((loc = this.uniforms[name]) != null) {
//         return gl.uniform3f(loc, x, y, z);
//       }
//     };

//     ShaderProgram.prototype.setUniform4f = function(gl, name, x, y, z, w) {
//       var loc;
//       if ((loc = this.uniforms[name]) != null) {
//         return gl.uniform4f(loc, x, y, z, w);
//       }
//     };

//     ShaderProgram.prototype.setUniform1fv = function(gl, name, arr) {
//       var loc;
//       if ((loc = this.uniforms[name]) != null) {
//         return gl.uniform1fv(loc, arr);
//       }
//     };

//     ShaderProgram.prototype.setUniform2fv = function(gl, name, arr) {
//       var loc;
//       if ((loc = this.uniforms[name]) != null) {
//         return gl.uniform2fv(loc, arr);
//       }
//     };

//     ShaderProgram.prototype.setUniform3fv = function(gl, name, arr) {
//       var loc;
//       if ((loc = this.uniforms[name]) != null) {
//         return gl.uniform3fv(loc, arr);
//       }
//     };

//     ShaderProgram.prototype.setUniform4fv = function(gl, name, arr) {
//       var loc;
//       if ((loc = this.uniforms[name]) != null) {
//         return gl.uniform4fv(loc, arr);
//       }
//     };

//     ShaderProgram.prototype.setUniformMatrix1fv = function(gl, name, m) {
//       var loc;
//       if ((loc = this.uniforms[name]) != null) {
//         return gl.uniformMatrix1fv(loc, gl.FALSE, m);
//       }
//     };

//     ShaderProgram.prototype.setUniformMatrix2fv = function(gl, name, m) {
//       var loc;
//       if ((loc = this.uniforms[name]) != null) {
//         return gl.uniformMatrix2fv(loc, gl.FALSE, m);
//       }
//     };

//     ShaderProgram.prototype.setUniformMatrix3fv = function(gl, name, m) {
//       var loc;
//       if ((loc = this.uniforms[name]) != null) {
//         return gl.uniformMatrix3fv(loc, gl.FALSE, m);
//       }
//     };

//     ShaderProgram.prototype.setUniformMatrix4fv = function(gl, name, m) {
//       var loc;
//       if ((loc = this.uniforms[name]) != null) {
//         return gl.uniformMatrix4fv(loc, gl.FALSE, m);
//       }
//     };

//     return ShaderProgram;

//   })();

//   animationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || (function(callback) {
//     return window.setTimeout(callback, 1000 / 60);
//   });

//   Demo = (function() {
//     function Demo(canvas1) {
//       this.canvas = canvas1;
//       this.tick = bind(this.tick, this);
//       this.resize = bind(this.resize, this);
//       this.onScroll_ = bind(this.onScroll_, this);
//       this.gl = getWebGLContext(this.canvas);
//       this.celShader = new ShaderProgram(this.gl, CelVertShaderSrc, CelFragShaderSrc, {
//         a_position: 0,
//         a_normal: 1
//       });
//       this.outlineShader = new ShaderProgram(this.gl, OutlineVertShaderSrc, OutlineFragShaderSrc, {
//         a_position: 0,
//         a_normal: 1
//       });
//       this.vbo = new VertexBuffer(this.gl);
//       this.ibo = new IndexBuffer(this.gl);
//       this.gl.enable(this.gl.DEPTH_TEST);
//       this.projection = mat4.create();
//       this.modelview = mat4.create();
//       this.normalMat = mat3.create();
//       this.translation = TRANSLATION;
//       this.rotation = mat4.identity(mat4.create());
//       this.modelview = mat4.translate(this.modelview, this.modelview, this.translation);
//       this.mouse = vec2.create();
//       this.mouseDown = false;
//       this.canvas.onmousedown = (function(_this) {
//         return function(e) {
//           return _this.onMouse_(e, e.clientX, e.clientY, true, false);
//         };
//       })(this);
//       document.onmouseup = (function(_this) {
//         return function(e) {
//           return _this.onMouse_(e, e.clientX, e.clientY, false, false);
//         };
//       })(this);
//       document.onmousemove = (function(_this) {
//         return function(e) {
//           return _this.onMouse_(e, e.clientX, e.clientY, _this.mouseDown, true);
//         };
//       })(this);
//       this.canvas.ontouchstart = (function(_this) {
//         return function(e) {
//           return _this.onMouse_(e, e.touches[0].clientX, e.touches[0].clientY, true, false);
//         };
//       })(this);
//       document.ontouchend = (function(_this) {
//         return function(e) {
//           return _this.onMouse_(e, e.touches[0].clientX, e.touches[0].clientY, false, false);
//         };
//       })(this);
//       document.ontouchmove = (function(_this) {
//         return function(e) {
//           return _this.onMouse_(e, e.touches[0].clientX, e.touches[0].clientY, _this.mouseDown, true);
//         };
//       })(this);
//       document.onmousewheel = this.onScroll_;
//       window.addEventListener('DOMMouseScroll', this.onScroll_, false);
//       window.addEventListener('resize', this.resize);
//       this.resize();
//     }

//     Demo.prototype.onScroll_ = function(arg) {
//       var wheelDelta;
//       wheelDelta = arg.wheelDelta;
//       return this.translation[2] += wheelDelta >= 0 ? 0.05 : -0.05;
//     };

//     Demo.prototype.onMouse_ = function(e, x, y, mouseDown, moved) {
//       var deg2rad, dx, dy, mx, my, nmat, rect, ref;
//       this.mouseDown = mouseDown;
//       rect = this.canvas.getBoundingClientRect();
//       mx = x - rect.left;
//       my = y - rect.top;
//       e.preventDefault();
//       if (this.mouseDown && moved) {
//         deg2rad = Math.PI / 180;
//         nmat = mat4.identity(mat4.create());
//         ref = [mx - this.mouse[0], my - this.mouse[1]], dx = ref[0], dy = ref[1];
//         mat4.rotateY(nmat, nmat, dx * deg2rad / 5);
//         mat4.rotateX(nmat, nmat, dy * deg2rad / 5);
//         mat4.multiply(this.rotation, nmat, this.rotation);
//       }
//       return vec2.set(this.mouse, mx, my);
//     };

//     Demo.prototype.zoom = function(amt) {
//       return translation[2] += amt;
//     };

//     Demo.prototype.resize = function() {
//       var aspect, deg2rad, fovy;
//       this.canvas.width = window.innerWidth;
//       this.canvas.height = window.innerHeight;
//       this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
//       deg2rad = Math.PI / 180;
//       fovy = FIELD_OF_VIEW_DEG * deg2rad;
//       aspect = this.canvas.width / this.canvas.height;
//       return this.projection = mat4.perspective(this.projection, fovy, aspect, Z_NEAR, Z_FAR);
//     };

//     Demo.prototype.update = function(time, dt) {
//       if (!this.mouseDown) {
//         mat4.rotateY(this.rotation, this.rotation, dt / 1000);
//       }
//       mat4.identity(this.modelview);
//       mat4.translate(this.modelview, this.modelview, this.translation);
//       mat4.multiply(this.modelview, this.modelview, this.rotation);
//       return mat3.normalFromMat4(this.normalMat, this.modelview);
//     };

//     Demo.prototype.bindAttrs = function(gl, shader) {
//       this.vbo.bind(gl);
//       this.ibo.bind(gl);
//       gl.enableVertexAttribArray(shader.attributes.a_position);
//       gl.enableVertexAttribArray(shader.attributes.a_normal);
//       gl.vertexAttribPointer(shader.attributes.a_position, 3, gl.FLOAT, false, 6 * 4, 0);
//       return gl.vertexAttribPointer(shader.attributes.a_normal, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
//     };

//     Demo.prototype.render = function(time, dt, accum) {
//       var gl;
//       gl = this.gl;
//       gl.clearColor(0.5, 0.5, 0.5, 1);
//       gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//       this.outlineShader.use(gl);
//       this.bindAttrs(gl, this.outlineShader);
//       this.outlineShader.setUniformMatrix4fv(gl, 'u_projectionMat', this.projection);
//       this.outlineShader.setUniformMatrix4fv(gl, 'u_modelviewMat', this.modelview);
//       gl.enable(gl.CULL_FACE);
//       this.outlineShader.setUniform1f(gl, 'u_offset', OUTLINE_WIDTH);
//       this.outlineShader.setUniform4fv(gl, 'u_color', OUTLINE_COLOR);
//       gl.drawElements(gl.TRIANGLES, IndexCount, gl.UNSIGNED_SHORT, 0);
//       this.outlineShader.setUniform1f(gl, 'u_offset', 0.0);
//       this.outlineShader.setUniform4fv(gl, 'u_color', vec4.fromValues(1, 1, 1, 1));
//       gl.disable(gl.CULL_FACE);
//       glCheckAndLogError(gl);
//       this.celShader.use(gl);
//       this.celShader.setUniform3fv(gl, 'u_diffuse', DIFFUSE);
//       this.celShader.setUniform3fv(gl, 'u_ambient', AMBIENT);
//       this.celShader.setUniform3fv(gl, 'u_specular', SPECULAR);
//       this.celShader.setUniform1f(gl, 'u_shine', SHININESS);
//       this.celShader.setUniform3fv(gl, 'u_light', LIGHT_POSITION);
//       this.celShader.setUniform1f(gl, 'u_celShading', CEL_SHADING_LEVEL);
//       this.celShader.setUniformMatrix4fv(gl, 'u_projectionMat', this.projection);
//       this.celShader.setUniformMatrix4fv(gl, 'u_modelviewMat', this.modelview);
//       this.celShader.setUniformMatrix3fv(gl, 'u_normalMat', this.normalMat);
//       this.bindAttrs(gl, this.celShader);
//       return gl.drawElements(gl.TRIANGLES, IndexCount, gl.UNSIGNED_SHORT, 0);
//     };

//     Demo.prototype.tick = function() {
//       var dt, frameTime, newTime;
//       newTime = new Date().getTime();
//       frameTime = newTime - this.currentTime;
//       dt = 1 / 60;
//       this.currentTime = newTime;
//       this.accum += frameTime;
//       while (this.accum >= dt) {
//         this.update(this.t, dt);
//         this.t += dt;
//         this.accum -= dt;
//       }
//       animationFrame(this.tick);
//       return this.render(this.t, dt, this.accum);
//     };

//     Demo.prototype.start = function() {
//       this.t = 0;
//       this.currentTime = new Date().getTime();
//       this.accum = 0;
//       return this.tick();
//     };

//     return Demo;

//   })();

//   demo = new Demo(document.getElementById('screen'));

//   demo.start();

// }
