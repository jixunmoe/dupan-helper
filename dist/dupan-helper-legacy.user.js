// ==UserScript==
// @name              仓库用度盘投稿助手 (兼容版)
// @name:en           Baidu™ WebDisk Helper (dupan-helper) (Legacy)
// @namespace         moe.jixun.dupan.galacg
// @version           1.3.16
// @description       简易功能增强, 方便仓库投稿用
// @description:en    Enhancements for Baidu™ WebDisk.
// @author            Jixun<https://jixun.moe/>

// @match             https://pan.baidu.com/disk/home*
// @match             https://yun.baidu.com/disk/home*

// @compatible        firefox Greasemonkey (有限/Limited)
// @compatible        firefox Tampermonkey
// @compatible        firefox Violentmonkey
// @compatible        chrome Violentmonkey
// @compatible        chrome Tampermonkey
// @compatible        opera Violentmonkey
// @compatible        opera Tampermonkey
// @incompatible      safari

// @license           MIT
// @supportURL        https://github.com/JixunMoe/dupan-helper/issues
// @contributionURL   https://jixun.moe/donate

// @grant             none
// @run-at            document-start
// ==/UserScript==


function entryPoint () {
'use strict';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".jx_btn {\n    background: #fefefe;\n    background: linear-gradient(to bottom,  #fefefe 0%,#f2f2f2 88%);\n\n    display: inline-block;\n    line-height: 25px;\n    vertical-align: middle;\n    margin: 0 0 0 10px;\n    text-decoration: none;\n    border: 1px solid #AAA;\n    padding: 0 20px;\n    height: 26px;\n    border-radius: 2px;\n\n    min-width: 3em;\n    text-align: center;\n}\n.jx_btn, .jx_btn:hover, .jx_btn:focus {\n    color: #666;\n}\n.jx_btn:active {\n    color: #06C;\n    background: #e3e3e3;\n    background: -moz-linear-gradient(top,  #e3e3e3 0%, #f7f7f7 12%);\n    background: -webkit-linear-gradient(top,  #e3e3e3 0%,#f7f7f7 12%);\n    background: linear-gradient(to bottom,  #e3e3e3 0%,#f7f7f7 12%);\n}\n.jx-input {\n    margin: 9px 0;\n    padding: 0 0 0 5px;\n    width: 200px;\n    height: 24px;\n    vertical-align: middle;\n    border: 1px solid rgba(58,140,255,.3);\n    background: #fff;\n    border-radius: 2px;\n}\n\n.jx_hide   { display: none }\n.jx_c_warn { color: red }\n\n.jx_list {\n    text-align: left;\n    max-height: 5.5em;\n    overflow-y: scroll;\n    overflow-x: hidden;\n    line-height: 1;\n    padding: .2em;\n    margin-bottom: .5em;\n}\n\n/*\n.jx_list:not(:empty) {\n  border: 1px solid #ddd;\n}\n*/\n\n.jx_list > li {\n    display: flex;\n    white-space: nowrap;\n    line-height: 1.3;\n}\n\n.jx_list .name {\n    color: black;\n\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n.jx_list .size {\n    color: #777;\n\n    flex-grow: 1;\n}\n\n.save-complete-details {\n    max-height: 30em;\n}\n\n.jx-status {\n    padding-left: 0.25em;\n}\n\n.jx-status-success {\n    color: green;\n}\n\n.jx-status-skip {\n    color: gray;\n}\n\n.jx-status-fail {\n    color: red;\n}\n\ntextarea.jx{\n    width: 100%;\n    min-height: 5em;\n    line-height: 1;\n}\n\n.jx-form-options {\n    display: flex;\n    justify-content: left;\n}\n\n.jx-form-options > label {\n    display: inline-flex;\n    align-items: center;\n}\n\n.jx-form-options > label + label {\n    margin-left: 0.5em;\n}\n\n.jx-form-options > label > input {\n    margin-right: 0.25em;\n}\n\n.dialog-header-title > .select-text {\n    pointer-events: none;\n}\n\n.g-button-violet .text,\n.g-button-violet .icon,\n.g-button.g-button-violet:hover .icon {\n    color: #fff;\n}\n\n.g-button.g-button-violet:hover .icon {\n    opacity: 0.9;\n}\n\n.g-button-violet {\n    background: #A238FF;\n    border: 1px solid #A238FF;\n}\n\n.g-button-violet:hover {\n    background: #AE52FF;\n    border: 1px solid #AE52FF\n}\n";
styleInject(css_248z);

var TAG = '[仓库助手]';
var pluginBlacklist = ['右上角广告位', '网盘APP下载', '满减活动', '会员提醒'];

var oRequire;
var hooks = new Map();

function fakeRequire(module) {
  // console.info('%s Load module: %s', INFO, module);
  var result = oRequire.apply(this, arguments);
  var moduleHook = hooks.get(module);

  if (moduleHook) {
    try {
      moduleHook();
    } catch (e) {
      console.error('%s: 执行 %s hook 时发生错误: %s', TAG, e.message);
      console.trace(e);
    }

    hooks["delete"](module);
  }

  return result;
}

function load(module) {
  return oRequire.call(window, module);
}
function loadAsync(module) {
  return new Promise(function (resolve) {
    fakeRequire.async(module, resolve);
  });
}
function hook(module, fn) {
  hooks.set(module, fn);
}

if (window.require) {
  console.warn('%s 覆盖方式安装，若无效请强制刷新。', TAG);
  oRequire = window.require;
  window.require = fakeRequire;
  Object.assign(fakeRequire, oRequire);
} else {
  console.info('%s 钩子方式安装，若失效请报告。', TAG);
  Object.defineProperty(window, 'require', {
    set: function set(require) {
      oRequire = require;
    },
    get: function get() {
      return fakeRequire;
    }
  });
} // window.__debug_G = _G;

function getFileList() {
  return load('disk-system:widget/pageModule/list/listInit.js');
}
function getCheckedItems() {
  return getFileList().getCheckedItems();
}
function anythingChecked() {
  return getCheckedItems().length > 0;
}
function getCurrentDirectory() {
  return getFileList().currentKey;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

var regenerator = runtime_1;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var asyncToGenerator = _asyncToGenerator;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var defineProperty = _defineProperty;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

var getPrototypeOf = createCommonjsModule(function (module) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
});

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

var superPropBase = _superPropBase;

var get = createCommonjsModule(function (module) {
function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    module.exports = _get = Reflect.get;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

module.exports = _get;
});

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var createClass = _createClass;

var setPrototypeOf = createCommonjsModule(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
});

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

var inherits = _inherits;

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var assertThisInitialized = _assertThisInitialized;

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

var possibleConstructorReturn = _possibleConstructorReturn;

var css_248z$1 = ".jx-dialog-body {\n    text-align:center;\n    padding:22px;\n}\n";
styleInject(css_248z$1);

var id = 0;
function nextId() {
  // eslint-disable-next-line no-plusplus
  return id++;
}

function firstFunction() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return fns.find(function (fn) {
    return typeof fn === 'function';
  });
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function getDialog() {
  return load('system-core:system/uiService/dialog/dialog.js');
}
var bigButton = {
  type: 'big',
  padding: ['50px', '50px']
};
function confirmDialog(data) {
  var dialog;

  var hideDialog = function hideDialog() {
    return dialog.hide();
  };

  var dialogData = {
    id: "confirm-".concat(nextId()),
    show: true,
    title: data.title,
    body: $('<div class="jx-dialog-body">').append(data.body),
    buttons: [_objectSpread({}, bigButton, {
      name: 'confirm',
      title: data.sureText || '确定',
      color: 'blue',
      click: firstFunction(data.onSure, hideDialog)
    })]
  };

  if (data.cancel !== false) {
    dialogData.buttons.push(_objectSpread({}, bigButton, {
      name: 'cancel',
      title: data.cancelText || '取消',
      click: firstFunction(data.onCancel, hideDialog)
    }));
  }

  var Dialog = getDialog();
  dialog = new Dialog(dialogData);
  return dialog;
}
function infoDialog(data) {
  return confirmDialog(_objectSpread({}, data, {
    cancel: false
  }));
}

function getTip() {
  return load('system-core:system/uiService/tip/tip.js');
}
function showTip() {
  return getTip().show.apply(this, arguments);
}
function hideTip() {
  return getTip().hide.apply(this, arguments);
}

function getContext() {
  return load('system-core:context/context.js').instanceForSystem;
}

function getErrorMessage(code) {
  var msg = String(getContext().errorMsg(code));
  return msg.replace(/\s+rapidupload 错误码$/, '');
}
function injectErrorMessage(obj) {
  if ($.isPlainObject(obj)) {
    obj.error = obj.show_msg || getErrorMessage(obj.errno || 0);
  }

  return obj;
}

function ajax(_x) {
  return _ajax.apply(this, arguments);
}

function _ajax() {
  _ajax = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(data) {
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve) {
              $.ajax(data).fail(function (err) {
                resolve({
                  errno: -1,
                  error: '网络错误。'
                });
                console.error('%s 网络请求错误: %o', TAG, err);
              }).success(function (result) {
                resolve(injectErrorMessage(result));
              });
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ajax.apply(this, arguments);
}

var div = document.createElement('a');
var escapeDict = {
  '"': 'quot',
  "'": 'apos'
};

function escapeHtml(text) {
  div.textContent = text;
  var result = div.innerHTML.replace(/["']/g, function (x) {
    return "&".concat(escapeDict[x], ";");
  });
  div.textContent = '';
  return result;
}

var template = "<div>\n  <p><label>请输入分享密码: <input id=\"jx_shareKey\" class=\"jx-input\" style=\"width: 6em\"/></label></p>\n  <p class=\"jx_errmsg jx_c_warn jx_hide\">无效的分享密码, 脚本将随机生成一个分享代码 &hellip;</p>\n</div>\n\n<div class=\"jx_hide\">\n  <p><label>分享地址: <input id=\"jx_shortUrl\" class=\"jx-input\" style=\"width: 20em\" readonly/></label></p>\n  <p><label>分享密码: <input id=\"jx_shareCode\" class=\"jx-input\" style=\"width: 5em; text-align: center\" readonly/></label></p>\n\n  <p style=\"text-align: left\">\n    <label for=\"jx_dlboxCode\">投稿代码:</label><br/>\n    <textarea readonly id=\"jx_dlboxCode\" class=\"jx jx-input\"></textarea>\n  </p>\n</div>\n";

var PREFIX = '__jx_';

var LocalStore = /*#__PURE__*/function () {
  function LocalStore(id) {
    classCallCheck(this, LocalStore);

    this.id = id;
  }

  createClass(LocalStore, [{
    key: "value",
    get: function get() {
      return localStorage.getItem(this.id);
    },
    set: function set(value) {
      return localStorage.setItem(this.id, value);
    }
  }], [{
    key: "create",
    value: function create(instance, key) {
      return new LocalStore("".concat(PREFIX, "_").concat(instance.constructor.name, "_").concat(key));
    }
  }]);

  return LocalStore;
}();

var OpDialog = /*#__PURE__*/function () {
  createClass(OpDialog, [{
    key: "createStore",
    value: function createStore(key) {
      return LocalStore.create(this, key);
    }
  }]);

  function OpDialog(template) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    classCallCheck(this, OpDialog);

    defineProperty(this, "confirmText", '确定');

    this.root = $(template);
    this.title = options.title || '';

    if (options.confirmText) {
      this.confirmText = options.confirmText;
    }

    this.bindContext();
    this.createDialog();
    this.bootstrap();
  }

  createClass(OpDialog, [{
    key: "bindContext",
    value: function bindContext() {
      this.show = this.show.bind(this);
      this.hide = this.hide.bind(this);
      this.onConfirm = this.onConfirm.bind(this);
      this.onCancel = this.onCancel.bind(this);
    }
  }, {
    key: "createDialog",
    value: function createDialog() {
      this.dialog = confirmDialog({
        title: this.title,
        body: this.root,
        sureText: this.confirmText,
        onSure: this.onConfirm,
        onCancel: this.onCancel
      });
    }
    /**
     * 选择对话框内的内容。
     * @param selector
     * @returns {JQuery<HTMLElement>}
     */

  }, {
    key: "$",
    value: function (_$) {
      function $(_x) {
        return _$.apply(this, arguments);
      }

      $.toString = function () {
        return _$.toString();
      };

      return $;
    }(function (selector) {
      return $(selector, this.root);
    })
    /**
     * Bind events.
     */

  }, {
    key: "bootstrap",
    value: function bootstrap() {
      return this;
    }
  }, {
    key: "show",
    value: function show() {
      this.dialog.show();
    }
  }, {
    key: "hide",
    value: function hide() {
      this.dialog.hide();
    }
  }, {
    key: "onConfirm",
    value: function () {
      var _onConfirm = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.hide();

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function onConfirm() {
        return _onConfirm.apply(this, arguments);
      }

      return onConfirm;
    }()
  }, {
    key: "onCancel",
    value: function onCancel() {
      this.hide();
    }
  }]);

  return OpDialog;
}();

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { return function () { var Super = getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
/* 依赖函数表 */

function isCodeValid(code) {
  return encodeURIComponent(code).replace(/%[A-F\d]{2}/gi, '-').length === 4;
}

function fixCode(code) {
  return code.replace(/"/g, '&#x22;').replace(/]/g, '&#x5D;');
}

function fixWidthDigits(d) {
  return "0".concat(d.toString()).slice(-2);
}

function makeDate(d) {
  return "".concat(d.getFullYear(), ".").concat(fixWidthDigits(d.getMonth() + 1), ".").concat(fixWidthDigits(d.getDate()));
}

function genKey() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
  // length => 26 + 10, 36
  var keySet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var r = '';

  for (var i = size; i--;) {
    // eslint-disable-next-line no-bitwise
    r += keySet[0 | Math.random() * 36];
  }

  return r;
}

function getFileId(item) {
  return item.fs_id;
}

var CustomShareDialog = /*#__PURE__*/function (_OpDialog) {
  inherits(CustomShareDialog, _OpDialog);

  var _super = _createSuper(CustomShareDialog);

  createClass(CustomShareDialog, null, [{
    key: "create",

    /**
     * @param {Object} config
     * @return CustomShareDialog
     */
    value: function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new CustomShareDialog(config);
    }
    /**
     * @param {Object} config
     */

  }]);

  function CustomShareDialog() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    classCallCheck(this, CustomShareDialog);

    return _super.call(this, template, _objectSpread$1({
      title: '自定义分享'
    }, config));
  }

  createClass(CustomShareDialog, [{
    key: "bindContext",
    value: function bindContext() {
      get(getPrototypeOf(CustomShareDialog.prototype), "bindContext", this).call(this);

      this.validateCode = this.validateCode.bind(this);
      this.hideError = this.hideError.bind(this);
    }
  }, {
    key: "bootstrap",
    value: function bootstrap() {
      this.codeStore = LocalStore.create(this, 'code');
      this.$error = this.$('.jx_errmsg');
      this.$footer = this.dialog.find(getDialog().QUERY.dialogFooter);
      this.$key = this.$('#jx_shareKey').val(this.codeStore.value || genKey());
      this.$key.on('input change', this.validateCode);
      this.$key.on('focus', this.hideError);
    }
  }, {
    key: "onConfirm",
    value: function () {
      var _onConfirm = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        var key, sharedItems, resp, url, title, code;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.hide();
                key = this.$key.val();

                if (!isCodeValid(key)) {
                  key = genKey(4);
                  this.$key.val(key);
                }

                this.codeStore.value = key;
                showTip({
                  mode: 'loading',
                  msg: '正在分享，请稍后 ...',
                  autoClose: false
                });
                sharedItems = getCheckedItems();
                _context.next = 8;
                return ajax({
                  url: '/share/set',
                  type: 'POST',
                  data: {
                    fid_list: JSON.stringify(sharedItems.map(getFileId)),
                    schannel: 4,
                    channel_list: '[]',
                    pwd: key,
                    // 0: 永久
                    // 1、7: 天数
                    period: 0
                  },
                  dataType: 'json'
                });

              case 8:
                resp = _context.sent;
                hideTip();

                if (!(resp.errno || !resp.shorturl)) {
                  _context.next = 13;
                  break;
                }

                showTip({
                  mode: 'failure',
                  msg: "\u5206\u4EAB\u5931\u8D25\uFF1A".concat(resp.error)
                });
                return _context.abrupt("return");

              case 13:
                showTip({
                  mode: 'success',
                  msg: '分享成功!'
                });
                this.$footer.children('.g-button-blue-large').hide();
                this.$footer.children('.g-button-large').find('.text').text('关闭');
                url = "".concat(resp.shorturl, "#").concat(key);
                this.$('#jx_shortUrl').val(url);
                this.$('#jx_shareCode').val(key);
                this.root.toggleClass('jx_hide');
                title = fixCode(sharedItems[0].server_filename) + (sharedItems.length === 1 ? '' : ' 等文件');
                code = "[dlbox title=\"".concat(escapeHtml(title), "\" from=\"\u6D69\u701A\u7684\u5B87\u5B99\" time=\"").concat(makeDate(new Date()), "\" ") + "info=\"\u63D0\u53D6\uFF1A".concat(escapeHtml(key), "\" link1=\"\u5EA6\u5A18|").concat(url, "\"][/dlbox]");
                this.$('#jx_dlboxCode').val(code);
                this.show();

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function onConfirm() {
        return _onConfirm.apply(this, arguments);
      }

      return onConfirm;
    }()
    /**
     * @returns string
     */

  }, {
    key: "hideError",
    value: function hideError() {
      this.$error.addClass('jx_hide');
    }
  }, {
    key: "validateCode",
    value: function validateCode() {
      this.$error.toggleClass('jx_hide', this.isValueValid);
    }
  }, {
    key: "value",
    get: function get() {
      return this.$key.val();
    }
  }, {
    key: "isValueValid",
    get: function get() {
      return encodeURIComponent(this.value).replace(/%[A-F\d]{2}/gi, '-').length === 4;
    }
  }]);

  return CustomShareDialog;
}(OpDialog);

var template$1 = "<p>\n  <label for=\"jx_nameRule\">请输入新的命名规则 (自动储存)</label>:\n  <input id=\"jx_nameRule\" class=\"jx-input\" style=\"width:20em\" />\n</p>\n\n<p style=\"line-height: 1; padding-top: 1em;\">\n  <code>:n</code> 表示不带扩展名的文件名; <code>:e</code> 表示扩展名; <code>:E</code> 表示 .扩展名;\n  <br><code>:d</code> 表示一位随机数字; <code>:c</code> 表示一位随机字符; <code>:t</code> 表示当前时间戳\n</p>\n";

function getMessage() {
  return load('system-core:system/baseService/message/message.js');
}
function trigger(event) {
  getMessage().trigger(event);
}
/**
 * 刷新当前文件列表
 */

function refreshFileListView() {
  trigger('system-refresh');
}

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper$1(Derived) { return function () { var Super = getPrototypeOf(Derived), result; if (_isNativeReflectConstruct$1()) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
var fixRules = {
  n: function n(name) {
    var match = name.match(/^(.+)\./);
    return match ? match[1] : match;
  },
  c: function c() {
    return String.fromCharCode(97 + Math.random() * 26);
  },
  d: function d() {
    return Math.random().toString().slice(3, 4);
  },
  t: function t() {
    return Date.now();
  },
  e: function e(name) {
    var ext = name.match(/\.([^.]+)$/);
    return ext ? ext[1] : '';
  },
  E: function E(name) {
    return name.match(/\.[^.]+$/) || '';
  }
};
/* 依赖函数表 */

function fixName(name, code) {
  var fn = fixRules[code];

  if (fn) {
    return fn(name);
  }

  return null;
}

var BatchRenameDialog = /*#__PURE__*/function (_OpDialog) {
  inherits(BatchRenameDialog, _OpDialog);

  var _super = _createSuper$1(BatchRenameDialog);

  createClass(BatchRenameDialog, null, [{
    key: "create",

    /**
     * @param {Object} config
     * @return StandardCodeDialog
     */
    value: function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new BatchRenameDialog(config);
    }
    /**
     * @param {Object} config
     */

  }]);

  function BatchRenameDialog() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    classCallCheck(this, BatchRenameDialog);

    return _super.call(this, template$1, _objectSpread$2({
      title: '批量重命名'
    }, config));
  }

  createClass(BatchRenameDialog, [{
    key: "bindContext",
    value: function bindContext() {
      get(getPrototypeOf(BatchRenameDialog.prototype), "bindContext", this).call(this);

      this.namePatternStore = this.createStore('pattern');
    }
  }, {
    key: "bootstrap",
    value: function bootstrap() {
      this.$namePattern = this.$('#jx_nameRule');
      this.$namePattern.val(this.namePatternStore.value || '[GalACG] :d:d:d:d:d:d:d:d:d:d:E');
    }
  }, {
    key: "onConfirm",
    value: function () {
      var _onConfirm = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        var namePattern, fileList, resp;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.hide();
                namePattern = this.$namePattern.val();
                this.namePatternStore.value = namePattern;
                fileList = getCheckedItems().map(function (item) {
                  return {
                    path: item.path,
                    newname: namePattern.replace(/:([cdeEnt])/g, function (_, code) {
                      return fixName(item.server_filename, code);
                    })
                  };
                });
                showTip({
                  mode: 'loading',
                  msg: '正在批量重命名，请稍后 ...',
                  autoClose: false
                });
                _context.next = 7;
                return ajax({
                  url: '/api/filemanager?opera=rename',
                  type: 'POST',
                  data: {
                    filelist: JSON.stringify(fileList)
                  }
                });

              case 7:
                resp = _context.sent;
                hideTip();
                refreshFileListView();

                if (resp.errno) {
                  showTip({
                    mode: 'failure',
                    msg: "\u6279\u91CF\u91CD\u547D\u540D\u5931\u8D25, \u8BF7\u7A0D\u540E\u91CD\u8BD5! (".concat(resp.error, ")")
                  });
                } else {
                  showTip({
                    mode: 'success',
                    msg: '重命名成功!'
                  });
                }

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function onConfirm() {
        return _onConfirm.apply(this, arguments);
      }

      return onConfirm;
    }()
  }]);

  return BatchRenameDialog;
}(OpDialog);

function menuInsertAfter(list, name, item, noPush) {
  for (var i = 0; i < list.length; i++) {
    if (list[i] instanceof Array) {
      if (menuInsertAfter(list[i], name, item, true)) {
        return false;
      }
    } else if (list[i].title === name) {
      i++;
      list.splice(i, 0, item);
      return true;
    }
  }

  if (!noPush) list.push(item);
  return false;
}

function injectMenu() {
  var faceData = load('system-core:data/faceData.js');
  var fileCtxMenu = faceData.getData().contextMenu.file;
  menuInsertAfter(fileCtxMenu, '分享', {
    index: 8,
    keyboard: 'u',
    title: '自定义分享',
    display: anythingChecked,
    action: CustomShareDialog.create
  });
  fileCtxMenu.forEach(function (m) {
    if (m.index >= 2) {
      m.index += 1;
    }
  });
  fileCtxMenu.push({
    index: 2,
    // '删除' 的 index。
    keyboard: 'r',
    position: 'bottom',
    title: '批量重命名',
    display: anythingChecked,
    action: BatchRenameDialog.create
  });
}

var template$2 = "<form>\n  <p>\n    <label>\n      <textarea class=\"jx jx_code jx-input\" rows=\"7\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"></textarea>\n    </label>\n  </p>\n\n  <section class=\"jx-form-options\">\n    文件重复时：\n    <!-- <label><input name=\"ondup\" type=\"radio\" value=\"\" /> 忽略</label> -->\n    <label><input name=\"ondup\" type=\"radio\" value=\"newcopy\" checked /> 建立副本</label>\n    <label><input name=\"ondup\" type=\"radio\" value=\"overwrite\" /> 覆盖</label>\n  </section>\n\n  <!--\n  <p style=\"line-height: 1; padding: .5em 0;\">\n    扩展阅读:\n    <a href=\"http://game.ali213.net/thread-5465798-1-1.html\" target=\"_blank\">肚娘代码说明 [游侠]</a>\n    | <a href=\"https://jixun.moe/2017/06/13/du-code-gen/\" target=\"_blank\">标准度娘提取码 [梦姬]</a>\n  </p>\n  -->\n\n  <p style=\"text-align:left\">\n    <b>文件列表</b> (版本: <span class=\"jx_version\" style=\"color:black\">--</span>):\n  </p>\n  <ul class=\"jx_list\"></ul>\n  <p class=\"jx_c_warn jx_hide jx_errmsg\">识别不出任何有效的秒传链接。</p>\n</form>\n";

function debounce(fn) {
  var timer;
  return function () {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(fn);
  };
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

var arrayWithHoles = _arrayWithHoles;

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

var iterableToArrayLimit = _iterableToArrayLimit;

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

var arrayLikeToArray = _arrayLikeToArray;

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

var unsupportedIterableToArray = _unsupportedIterableToArray;

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var nonIterableRest = _nonIterableRest;

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

var slicedToArray = _slicedToArray;

/**
 * 将数值转换为 2 位数的十六进制文本。
 * @param {Number} value
 * @returns {string}
 */
function toStdHex(value) {
  var hex = Math.floor(value).toString(16);
  return "0".concat(hex).slice(-2);
}

var slice = Function.prototype.call.bind(Array.prototype.slice);
/**
 * 一个简单的类似于 NodeJS Buffer 的实现.
 * 用于解析游侠度娘提取码。
 */

var SimpleBuffer = /*#__PURE__*/function () {
  /**
   * @param {String} str
   */
  function SimpleBuffer(str) {
    classCallCheck(this, SimpleBuffer);

    this.fromString(str);
  }

  createClass(SimpleBuffer, [{
    key: "fromString",
    value: function fromString(str) {
      var len = str.length;
      this.buf = new Uint8Array(len);

      for (var i = 0; i < len; i++) {
        this.buf[i] = str.charCodeAt(i);
      }
    }
  }, {
    key: "readUnicode",
    value: function readUnicode(index, size) {
      var bufText = slice(this.buf, index, index + size).map(toStdHex);
      var buf = [''];

      for (var i = 0; i < size; i += 2) {
        buf.push(bufText[i + 1] + bufText[i]);
      }

      return JSON.parse("\"".concat(buf.join("\\u"), "\""));
    }
  }, {
    key: "readNumber",
    value: function readNumber(index, size) {
      var ret = 0;

      for (var i = index + size; i > index;) {
        ret = this.buf[--i] + ret * 256;
      }

      return ret;
    }
  }, {
    key: "readUInt",
    value: function readUInt(index) {
      return this.readNumber(index, 4);
    }
  }, {
    key: "readULong",
    value: function readULong(index) {
      return this.readNumber(index, 8);
    }
  }, {
    key: "readHex",
    value: function readHex(index, size) {
      return Array.prototype.slice.call(this.buf, index, index + size).map(toStdHex).join('');
    }
  }]);

  return SimpleBuffer;
}();

/**
 * UTF-8 字符转换成 base64 后在 JS 里解析会出毛病。
 * @param str
 * @returns {string}
 */

function decodeBase64(str) {
  try {
    str = atob(str);
  } catch (e) {
    console.error('%s: base64 decode failed: %s', TAG, str);
    console.trace(e);
    return '';
  }

  return decodeURIComponent(str.replace(/[^\x00-\x7F]/g, function (z) {
    return "%".concat(toStdHex(z.charCodeAt(0)));
  }));
}

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray$1(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var trim = function trim(str) {
  return String.prototype.trim.call(str);
};
/**
 * 百度网盘用的(非官方)标准提取码。
 * 支持解析：
 * 1. 游侠的 `BDLINK` 提取码
 * 2. 我的“标准提取码”
 * 3. PanDownload 的 `bdpan://` 协议。
 */


var DuParser = /*#__PURE__*/function () {
  function DuParser() {
    classCallCheck(this, DuParser);

    this.reset();
  }

  createClass(DuParser, [{
    key: "reset",
    value: function reset() {
      this.results = [];
      this.versions = new Set();
    }
    /**
     * 判断地址类型并解析。
     * @param url
     */

  }, {
    key: "parse",
    value: function parse(url) {
      // 游侠的格式是多行，不好判断结束位置。
      // 所以一次只能解析一条数据。
      if (url.indexOf('BDLINK') === 0) {
        this.parseAli(url);
        return;
      } // 其他两个格式一行一个文件信息。


      var links = url.split('\n').map(trim);

      var _iterator = _createForOfIteratorHelper(links),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var link = _step.value;

          if (link.startsWith('bdpan://')) {
            this.parsePanDownload(link);
          } else {
            this.parseStandard(link);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "hasResults",
    value: function hasResults() {
      return this.results.length;
    }
  }, {
    key: "parseAli",
    value: function parseAli(url) {
      var raw = atob(url.slice(6).replace(/\s/g, ''));
      if (raw.slice(0, 5) !== 'BDFS\x00') return null;
      var buf = new SimpleBuffer(raw);
      var ptr = 9;
      var fileCount = buf.readUInt(5);

      if (fileCount === 0) {
        return null;
      }

      this.versions.add('游侠 v1');

      for (var i = 0; i < fileCount; i++) {
        // 大小 (8 bytes)
        // MD5 + MD5S (0x20)
        // nameSize (4 bytes)
        // Name (unicode)
        var fileInfo = Object.create(null);
        fileInfo.size = buf.readULong(ptr);
        fileInfo.md5 = buf.readHex(ptr + 8, 0x10);
        fileInfo.md5s = buf.readHex(ptr + 0x18, 0x10);
        var sizeofName = buf.readUInt(ptr + 0x28) * 2;
        ptr += 0x2C;
        fileInfo.name = buf.readUnicode(ptr, sizeofName);
        this.results.push(fileInfo);
        ptr += sizeofName;
      }

      return true;
    }
  }, {
    key: "parseStandard",
    value: function parseStandard(szUrl) {
      var match = szUrl.trim().match(/^([\dA-F]{32})#([\dA-F]{32})#([\d]{1,20})#([\s\S]+)$/i);

      if (match) {
        var _match = slicedToArray(match, 5),
            md5 = _match[1],
            md5s = _match[2],
            size = _match[3],
            name = _match[4];

        this.versions.add('梦姬标准');
        this.results.push({
          md5: md5,
          md5s: md5s,
          size: size,
          name: name
        });
      }

      return null;
    }
  }, {
    key: "parsePanDownload",
    value: function parsePanDownload(szUrl) {
      var match = decodeBase64(szUrl.slice(8)).match(/^([\s\S]+)\|([\d]{1,20})\|([\dA-F]{32})\|([\dA-F]{32})$/i);

      if (match) {
        var _match2 = slicedToArray(match, 5),
            name = _match2[1],
            size = _match2[2],
            md5 = _match2[3],
            md5s = _match2[4];

        this.versions.add('PanDownload');
        this.results.push({
          md5: md5,
          md5s: md5s,
          size: size,
          name: name
        });
      }

      return null;
    }
  }]);

  return DuParser;
}();

/**
 * 将文本形式的文件大小转换为
 * @param {string} size
 * @returns {string}
 */
function parseSize(size) {
  var unit = 'MiB';
  var sizeInUnit = parseInt(size, 10) / 1024 / 1024; // 超过 GB

  if (sizeInUnit > 1024) {
    unit = 'GiB';
    sizeInUnit /= 1024;
  }

  return "".concat(sizeInUnit.toFixed(2), " ").concat(unit);
}

function itemInfo(item) {
  var name = escapeHtml(item.name);
  return "\n    <span class=\"name\" title=\"".concat(name, "\">").concat(name, "</span>\n    <span class=\"size\">(").concat(escapeHtml(parseSize(item.size)), ")</span>\n  ");
}

function wrapTag(tag) {
  return function (html) {
    return "<".concat(tag, ">").concat(html, "</").concat(tag, ">");
  };
}

var lower = Function.prototype.call.bind(String.prototype.toLowerCase);
var upper = Function.prototype.call.bind(String.prototype.toUpperCase);
function rapidUploadOnce(_x, _x2, _x3, _x4, _x5, _x6) {
  return _rapidUploadOnce.apply(this, arguments);
}

function _rapidUploadOnce() {
  _rapidUploadOnce = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(dir, name, md5, md5s, size, ondup) {
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (dir.slice(-1) !== '/') {
              dir += '/';
            }

            return _context.abrupt("return", ajax({
              url: '/api/rapidupload?rtype=1',
              type: 'POST',
              // https://github.com/iikira/BaiduPCS-Go/blob/9837f8e24328e5f881d6a07cf1249508c485a063/baidupcs/prepare.go#L272-L279
              data: {
                // overwrite: 表示覆盖同名文件; newcopy: 表示生成文件副本并进行重命名，命名规则为“文件名_日期.后缀”
                ondup: ondup,
                path: dir + name,
                'content-md5': md5,
                'slice-md5': md5s,
                'content-length': size,
                local_mtime: ''
              }
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _rapidUploadOnce.apply(this, arguments);
}

function rapidUpload(_x7, _x8, _x9) {
  return _rapidUpload.apply(this, arguments);
}

function _rapidUpload() {
  _rapidUpload = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(dir, file, ondup) {
    var name, md5, md5s, size, resp;
    return regenerator.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            name = file.name, md5 = file.md5, md5s = file.md5s, size = file.size; // 先尝试小写，如果失败则尝试大写。如果都失败则不重试。

            _context2.next = 3;
            return rapidUploadOnce(dir, name, lower(md5), lower(md5s), size, ondup);

          case 3:
            resp = _context2.sent;

            if (!(resp.errno === 0)) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", resp);

          case 6:
            return _context2.abrupt("return", rapidUploadOnce(dir, name, upper(md5), upper(md5s), size, ondup));

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _rapidUpload.apply(this, arguments);
}

function statusHtml(result) {
  var className = result.success ? 'success' : 'fail';
  return "<span class=\"jx-status jx-status-".concat(className, "\">").concat(result.error, "</span>");
}

function _createForOfIteratorHelper$1(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray$2(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper$2(Derived) { return function () { var Super = getPrototypeOf(Derived), result; if (_isNativeReflectConstruct$2()) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var defaultConfirmCallback = /*#__PURE__*/function () {
  var _ref = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", true);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function defaultConfirmCallback() {
    return _ref.apply(this, arguments);
  };
}();

var StandardCodeDialog = /*#__PURE__*/function (_OpDialog) {
  inherits(StandardCodeDialog, _OpDialog);

  var _super = _createSuper$2(StandardCodeDialog);

  createClass(StandardCodeDialog, null, [{
    key: "create",

    /**
     * @param {Object} config
     * @return StandardCodeDialog
     */
    value: function create(config) {
      return new StandardCodeDialog(config);
    }
  }]);

  function StandardCodeDialog() {
    var _this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    classCallCheck(this, StandardCodeDialog);

    _this = _super.call(this, template$2, _objectSpread$3({
      title: '从秒传链接导入'
    }, config));

    defineProperty(assertThisInitialized(_this), "confirmText", '导入');

    defineProperty(assertThisInitialized(_this), "confirmCallback", defaultConfirmCallback);

    if (config) {
      _this.setText(config.content);

      _this.setDirectory(config.directory);

      _this.setConfirmCallback(config.confirmCallback);

      _this.forceRefresh = config.forceRefresh || false;
    }

    return _this;
  }

  createClass(StandardCodeDialog, [{
    key: "bindContext",
    value: function bindContext() {
      get(getPrototypeOf(StandardCodeDialog.prototype), "bindContext", this).call(this);

      this.hideError = this.hideError.bind(this);
      this.updatePreview = this.updatePreview.bind(this);
      this.parser = new DuParser();
      this.directory = getCurrentDirectory();
    }
  }, {
    key: "bootstrap",
    value: function bootstrap() {
      this.jx_list = this.$('.jx_list');
      this.jx_code = this.$('.jx_code');
      this.jx_errmsg = this.$('.jx_errmsg');
      this.jx_version = this.$('.jx_version');
      this.jx_ondup = this.$('input[name="ondup"]');
      this.ondup = this.root[0].elements.ondup;
      this.ondupStore = this.createStore('ondup');
      this.jx_ondup.filter("[value=\"".concat(this.ondupStore.value, "\"]")).prop('checked', true);
      this.jx_code.on('blur input', debounce(this.updatePreview));
      this.jx_code.on('focus', this.hideError);
    }
  }, {
    key: "hideError",
    value: function hideError() {
      this.jx_errmsg.addClass('jx_hide');
    }
  }, {
    key: "updatePreview",
    value: function updatePreview() {
      var code = this.getText();
      this.parser.reset();
      this.parser.parse(code);
      var hasResults = this.parser.hasResults(); // 如果输入框不为空却没有解析到任何内容

      this.jx_errmsg.toggleClass('jx_hide', Boolean(!code || hasResults));

      if (hasResults) {
        this.jx_version.text(this.versions);
        this.jx_list.html(this.results.map(itemInfo).map(wrapTag('li')).join(''));
      } else {
        this.jx_version.text('--');
        this.jx_list.text('');
      }
    }
  }, {
    key: "setText",
    value: function setText(content) {
      this.jx_code.val(content || '');
      this.updatePreview();
    }
  }, {
    key: "getText",
    value: function getText() {
      return this.jx_code.val();
    }
  }, {
    key: "getDirectory",
    value: function getDirectory() {
      return this.directory;
    }
  }, {
    key: "setConfirmCallback",
    value: function setConfirmCallback(confirmCallback) {
      this.confirmCallback = confirmCallback || defaultConfirmCallback;
    }
  }, {
    key: "setDirectory",
    value: function setDirectory(directory) {
      if (!directory) {
        directory = getCurrentDirectory();
      }

      this.directory = directory;
    }
  }, {
    key: "onConfirm",
    value: function () {
      var _onConfirm = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
        var ondup, totalCount, failed, counter, _iterator, _step, file, resp;

        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.hide(); // 取消了操作

                _context2.next = 3;
                return this.confirmCallback();

              case 3:
                if (_context2.sent) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return");

              case 5:
                ondup = this.ondup.value;
                this.ondupStore.value = ondup;
                totalCount = this.results.length;
                failed = 0;
                counter = 1;
                _iterator = _createForOfIteratorHelper$1(this.results);
                _context2.prev = 11;

                _iterator.s();

              case 13:
                if ((_step = _iterator.n()).done) {
                  _context2.next = 27;
                  break;
                }

                file = _step.value;
                showTip({
                  mode: 'loading',
                  msg: "\u6B63\u5728\u8F6C\u5B58\u6587\u4EF6 (".concat(counter, "/").concat(totalCount, "), \u8BF7\u7A0D\u540E .."),
                  autoClose: false
                });
                _context2.next = 18;
                return rapidUpload(this.getDirectory(), file, ondup);

              case 18:
                resp = _context2.sent;
                file.success = resp.errno === 0;
                file.errno = resp.errno;
                file.error = resp.error;
                file.resp = resp;

                if (!file.success) {
                  failed++;
                }

                counter++;

              case 25:
                _context2.next = 13;
                break;

              case 27:
                _context2.next = 32;
                break;

              case 29:
                _context2.prev = 29;
                _context2.t0 = _context2["catch"](11);

                _iterator.e(_context2.t0);

              case 32:
                _context2.prev = 32;

                _iterator.f();

                return _context2.finish(32);

              case 35:
                if (this.forceRefresh || this.getDirectory() === getCurrentDirectory()) {
                  refreshFileListView();
                }

                infoDialog({
                  title: "\u8F6C\u5B58\u5B8C\u6BD5 (\u5931\u8D25 ".concat(failed, " \u4E2A, \u5171 ").concat(totalCount, " \u4E2A)!"),
                  body: "\n        <ul class=\"save-complete-details jx_list\">\n          ".concat(this.results.map(function (result) {
                    return "".concat(itemInfo(result)).concat(statusHtml(result));
                  }).map(wrapTag('li')).join(''), "\n        </ul>\n      "),
                  cancel: false
                });

              case 37:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[11, 29, 32, 35]]);
      }));

      function onConfirm() {
        return _onConfirm.apply(this, arguments);
      }

      return onConfirm;
    }()
  }, {
    key: "versions",
    get: function get() {
      return Array.from(this.parser.versions).join('、');
    }
  }, {
    key: "results",
    get: function get() {
      return this.parser.results;
    }
  }]);

  return StandardCodeDialog;
}(OpDialog);

function registerPlugin() {
  // 注入到 manifest 定义文件
  window.define('function-widget:jixun/standard-code.js', function (require, exports) {
    // require, exports, module
    exports.start = StandardCodeDialog.create;
  });
  window.manifest = window.manifest.filter(function (plugin) {
    return !pluginBlacklist.includes(plugin.name);
  });
  window.manifest.push({
    name: '秒传链接支持',
    group: 'moe.jixun.code',
    version: '1.0',
    type: '1',
    description: '类似于 115 的标准提取码',
    filesType: '*',
    buttons: [{
      index: 2,
      disabled: 'none',
      color: 'violet',
      icon: 'icon-upload',
      title: '秒传链接',
      buttonStyle: 'normal',
      pluginId: 'JIXUNSTDCODE',
      position: 'tools'
    }],
    preload: false,
    depsFiles: [],
    entranceFile: 'function-widget:jixun/standard-code.js',
    pluginId: 'JIXUNSTDCODE'
  });
}

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function parseQueryString(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  qs = qs.split(sep);
  var maxKeys = 1000;

  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length; // maxKeys <= 0 means that we should not limit keys count

  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i];
    var idx = x.indexOf(eq);
    var kstr = void 0;
    var vstr = void 0;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    var k = decodeURIComponent(kstr);
    var v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
}

var Query = /*#__PURE__*/function () {
  function Query() {
    classCallCheck(this, Query);

    this.search = {};
  }

  createClass(Query, [{
    key: "parse",
    value: function parse(source) {
      this.search = parseQueryString(source.replace(/^(#\??|\?)/g, '').replace(/\+/g, '%2b'));
    }
  }, {
    key: "has",
    value: function has(name) {
      return Object.prototype.hasOwnProperty.call(this.search, name);
    }
  }, {
    key: "get",
    value: function get(name) {
      return this.search[name];
    }
  }]);

  return Query;
}();

var css_248z$2 = ".jx-prev-path > span {\n    white-space: nowrap;\n    display: flex;\n    padding: 0 12px;\n}\n\n.jx-prev-path code {\n    padding-left: 0.5em;\n    flex-grow: 1;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n";
styleInject(css_248z$2);

var css_248z$3 = ".jx-checkbox {\n    display: none;\n}\n\n.jx-label {\n    cursor: pointer;\n}\n\n.jx-label span {\n    display: flex;\n}\n\n.jx-checkbox + span::before {\n    content: '';\n    padding-left: 20px;\n    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAOBAMAAACWQvIuAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURQAAAP///8rKyujt8TWJ4ViV2/b29srb7vLy8m2l4fX2+K3L6lKt8u7y93/G+Pn5+VodYkgAAAABdFJOUwBA5thmAAAAbElEQVQY02NQggAGZAATUzYGASMUOZiYRqIgEAihyIHFLIQY1AQx5UBiUjOFGBSxyIHElrpswi5nLCgf4roIq5yyy8WlLgexm6nt4h7iKYjDvhIXl4O45MRdPAVxyQmWPMQtJyGIWw4ihiesAfWzHJ0JZlnhAAAAAElFTkSuQmCC') no-repeat left;\n}\n\n.jx-checkbox:checked + span::before {\n    background-position-x: -40px;\n}\n";
styleInject(css_248z$3);

var Checkbox = /*#__PURE__*/function () {
  function Checkbox() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    classCallCheck(this, Checkbox);

    var _options$content = options.content,
        content = _options$content === void 0 ? '' : _options$content,
        _options$className = options.className,
        className = _options$className === void 0 ? '' : _options$className,
        _options$checked = options.checked,
        checked = _options$checked === void 0 ? false : _options$checked;
    this.root = $('<label class="jx-label">').addClass(className);
    this.$input = $('<input class="jx-checkbox" type="checkbox" />');
    this.$text = $('<span>');

    if (typeof content === 'string') {
      this.$text.text(content);
    } else {
      this.$text.append(content);
    }

    this.$input.prop('checked', checked);
    this.root.append(this.$input).append(this.$text);
  }

  createClass(Checkbox, [{
    key: "appendTo",
    value: function appendTo(target) {
      this.root.appendTo(target);
    }
  }, {
    key: "checked",
    get: function get() {
      return this.$input.prop('checked');
    },
    set: function set(checked) {
      return this.$input.prop('checked', Boolean(checked));
    }
  }]);

  return Checkbox;
}();

var ImportOnLoad = /*#__PURE__*/function () {
  createClass(ImportOnLoad, null, [{
    key: "create",
    value: function create(content) {
      return new ImportOnLoad(content);
    }
  }]);

  function ImportOnLoad() {
    var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    classCallCheck(this, ImportOnLoad);

    this.content = content;
    this.onConfirm = this.onConfirm.bind(this);
    this.selectDirectory = this.selectDirectory.bind(this);
    this.initTreeSelector()["catch"](console.error);
  }

  createClass(ImportOnLoad, [{
    key: "initTreeSelector",
    value: function () {
      var _initTreeSelector = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return loadAsync('disk-system:widget/system/baseService/shareDir/shareDirManager.js');

              case 2:
                _context.next = 4;
                return loadAsync('disk-system:widget/system/uiService/fileTreeDialog/fileTreeDialog.js');

              case 4:
                this.fileTreeDialog = _context.sent;
                this.ui = getContext().ui;
                this.directoryStore = LocalStore.create(this, 'import_dir');
                this.prevPath = this.directoryStore.value || '/';
                this.confirmFileList();

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initTreeSelector() {
        return _initTreeSelector.apply(this, arguments);
      }

      return initTreeSelector;
    }()
  }, {
    key: "selectDirectory",
    value: function selectDirectory() {
      var _this = this;

      this.dirSelectDialog = this.fileTreeDialog.show({
        title: '导入至…',
        confirm: this.onConfirm,
        isZip: true,
        showShareDir: false,
        path: '/'
      });
      this.$dialogBody = this.dirSelectDialog.dialog.$dialog.find(getDialog().QUERY.dialogBody);
      this.checkUsePrevPath = new Checkbox({
        content: '使用上次储存的位置',
        className: 'jx-prev-path',
        checked: true
      });
      this.checkUsePrevPath.appendTo(this.$dialogBody);
      this.$prevPath = $('<code>').text(this.prevPath);
      this.checkUsePrevPath.$text.append(this.$prevPath);
      this.checkUsePrevPath.root.prop('title', this.prevPath);
      return new Promise(function (resolve) {
        _this.resolveDirectorySelect = resolve;
      });
    }
  }, {
    key: "confirmFileList",
    value: function confirmFileList() {
      var content = this.content;
      this.stdCodeDialog = StandardCodeDialog.create({
        content: content,
        forceRefresh: true,
        confirmText: '选择目录',
        confirmCallback: this.selectDirectory
      });
    }
  }, {
    key: "onConfirm",
    value: function onConfirm(targetDir) {
      this.fileTreeDialog.hide();
      var directory = this.checkUsePrevPath.checked ? this.prevPath : targetDir;
      this.directoryStore.value = directory;
      this.stdCodeDialog.setDirectory(directory);
      this.resolveDirectorySelect(true);
    }
  }]);

  return ImportOnLoad;
}();

var KEY_BDLINK = 'bdlink';
var _window$location = window.location,
    search = _window$location.search,
    hash = _window$location.hash;
function initialiseQueryLink() {
  var query = new Query();
  query.parse(search);

  if (!query.has(KEY_BDLINK)) {
    query.parse(hash);
  }

  if (query.has(KEY_BDLINK)) {
    ImportOnLoad.create(decodeBase64(query.get(KEY_BDLINK).replace(/#.{4}$/, '')));
  }
}

hook('disk-system:widget/system/uiRender/menu/listMenu.js', injectMenu);
hook('system-core:pluginHub/register/register.js', registerPlugin);
hook('system-core:system/uiService/list/list.js', initialiseQueryLink); // ESC 将关闭所有漂浮窗口

document.addEventListener('keyup', function (e) {
  if (e.keyCode === 0x1b) {
    $('.dialog-close').click();
  }
}, false);

}

const isGm = (typeof unsafeWindow !== 'undefined') && (unsafeWindow !== window);
if (isGm) {
  const INFO = '[仓库助手]';

  console.info('%s 以 GreaseMonkey 兼容模式执行。该脚本管理器所遇到的问题不能保证能够修复。', INFO);
  unsafeWindow.eval(`;(${entryPoint})();`);
} else {
  entryPoint();
}

