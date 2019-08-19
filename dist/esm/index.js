(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.pwb = {}));
}(this, function (exports) { 'use strict';

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];

    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }

    return (hint === "string" ? String : Number)(input);
  }

  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");

    return typeof key === "symbol" ? key : String(key);
  }

  function _decorate(decorators, factory, superClass, mixins) {
    var api = _getDecoratorsApi();

    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        api = mixins[i](api);
      }
    }

    var r = factory(function initialize(O) {
      api.initializeInstanceElements(O, decorated.elements);
    }, superClass);
    var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
    api.initializeClassElements(r.F, decorated.elements);
    return api.runClassFinishers(r.F, decorated.finishers);
  }

  function _getDecoratorsApi() {
    _getDecoratorsApi = function () {
      return api;
    };

    var api = {
      elementsDefinitionOrder: [["method"], ["field"]],
      initializeInstanceElements: function (O, elements) {
        ["method", "field"].forEach(function (kind) {
          elements.forEach(function (element) {
            if (element.kind === kind && element.placement === "own") {
              this.defineClassElement(O, element);
            }
          }, this);
        }, this);
      },
      initializeClassElements: function (F, elements) {
        var proto = F.prototype;
        ["method", "field"].forEach(function (kind) {
          elements.forEach(function (element) {
            var placement = element.placement;

            if (element.kind === kind && (placement === "static" || placement === "prototype")) {
              var receiver = placement === "static" ? F : proto;
              this.defineClassElement(receiver, element);
            }
          }, this);
        }, this);
      },
      defineClassElement: function (receiver, element) {
        var descriptor = element.descriptor;

        if (element.kind === "field") {
          var initializer = element.initializer;
          descriptor = {
            enumerable: descriptor.enumerable,
            writable: descriptor.writable,
            configurable: descriptor.configurable,
            value: initializer === void 0 ? void 0 : initializer.call(receiver)
          };
        }

        Object.defineProperty(receiver, element.key, descriptor);
      },
      decorateClass: function (elements, decorators) {
        var newElements = [];
        var finishers = [];
        var placements = {
          static: [],
          prototype: [],
          own: []
        };
        elements.forEach(function (element) {
          this.addElementPlacement(element, placements);
        }, this);
        elements.forEach(function (element) {
          if (!_hasDecorators(element)) return newElements.push(element);
          var elementFinishersExtras = this.decorateElement(element, placements);
          newElements.push(elementFinishersExtras.element);
          newElements.push.apply(newElements, elementFinishersExtras.extras);
          finishers.push.apply(finishers, elementFinishersExtras.finishers);
        }, this);

        if (!decorators) {
          return {
            elements: newElements,
            finishers: finishers
          };
        }

        var result = this.decorateConstructor(newElements, decorators);
        finishers.push.apply(finishers, result.finishers);
        result.finishers = finishers;
        return result;
      },
      addElementPlacement: function (element, placements, silent) {
        var keys = placements[element.placement];

        if (!silent && keys.indexOf(element.key) !== -1) {
          throw new TypeError("Duplicated element (" + element.key + ")");
        }

        keys.push(element.key);
      },
      decorateElement: function (element, placements) {
        var extras = [];
        var finishers = [];

        for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) {
          var keys = placements[element.placement];
          keys.splice(keys.indexOf(element.key), 1);
          var elementObject = this.fromElementDescriptor(element);
          var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
          element = elementFinisherExtras.element;
          this.addElementPlacement(element, placements);

          if (elementFinisherExtras.finisher) {
            finishers.push(elementFinisherExtras.finisher);
          }

          var newExtras = elementFinisherExtras.extras;

          if (newExtras) {
            for (var j = 0; j < newExtras.length; j++) {
              this.addElementPlacement(newExtras[j], placements);
            }

            extras.push.apply(extras, newExtras);
          }
        }

        return {
          element: element,
          finishers: finishers,
          extras: extras
        };
      },
      decorateConstructor: function (elements, decorators) {
        var finishers = [];

        for (var i = decorators.length - 1; i >= 0; i--) {
          var obj = this.fromClassDescriptor(elements);
          var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj);

          if (elementsAndFinisher.finisher !== undefined) {
            finishers.push(elementsAndFinisher.finisher);
          }

          if (elementsAndFinisher.elements !== undefined) {
            elements = elementsAndFinisher.elements;

            for (var j = 0; j < elements.length - 1; j++) {
              for (var k = j + 1; k < elements.length; k++) {
                if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
                  throw new TypeError("Duplicated element (" + elements[j].key + ")");
                }
              }
            }
          }
        }

        return {
          elements: elements,
          finishers: finishers
        };
      },
      fromElementDescriptor: function (element) {
        var obj = {
          kind: element.kind,
          key: element.key,
          placement: element.placement,
          descriptor: element.descriptor
        };
        var desc = {
          value: "Descriptor",
          configurable: true
        };
        Object.defineProperty(obj, Symbol.toStringTag, desc);
        if (element.kind === "field") obj.initializer = element.initializer;
        return obj;
      },
      toElementDescriptors: function (elementObjects) {
        if (elementObjects === undefined) return;
        return _toArray(elementObjects).map(function (elementObject) {
          var element = this.toElementDescriptor(elementObject);
          this.disallowProperty(elementObject, "finisher", "An element descriptor");
          this.disallowProperty(elementObject, "extras", "An element descriptor");
          return element;
        }, this);
      },
      toElementDescriptor: function (elementObject) {
        var kind = String(elementObject.kind);

        if (kind !== "method" && kind !== "field") {
          throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"');
        }

        var key = _toPropertyKey(elementObject.key);

        var placement = String(elementObject.placement);

        if (placement !== "static" && placement !== "prototype" && placement !== "own") {
          throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"');
        }

        var descriptor = elementObject.descriptor;
        this.disallowProperty(elementObject, "elements", "An element descriptor");
        var element = {
          kind: kind,
          key: key,
          placement: placement,
          descriptor: Object.assign({}, descriptor)
        };

        if (kind !== "field") {
          this.disallowProperty(elementObject, "initializer", "A method descriptor");
        } else {
          this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor");
          this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor");
          this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor");
          element.initializer = elementObject.initializer;
        }

        return element;
      },
      toElementFinisherExtras: function (elementObject) {
        var element = this.toElementDescriptor(elementObject);

        var finisher = _optionalCallableProperty(elementObject, "finisher");

        var extras = this.toElementDescriptors(elementObject.extras);
        return {
          element: element,
          finisher: finisher,
          extras: extras
        };
      },
      fromClassDescriptor: function (elements) {
        var obj = {
          kind: "class",
          elements: elements.map(this.fromElementDescriptor, this)
        };
        var desc = {
          value: "Descriptor",
          configurable: true
        };
        Object.defineProperty(obj, Symbol.toStringTag, desc);
        return obj;
      },
      toClassDescriptor: function (obj) {
        var kind = String(obj.kind);

        if (kind !== "class") {
          throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"');
        }

        this.disallowProperty(obj, "key", "A class descriptor");
        this.disallowProperty(obj, "placement", "A class descriptor");
        this.disallowProperty(obj, "descriptor", "A class descriptor");
        this.disallowProperty(obj, "initializer", "A class descriptor");
        this.disallowProperty(obj, "extras", "A class descriptor");

        var finisher = _optionalCallableProperty(obj, "finisher");

        var elements = this.toElementDescriptors(obj.elements);
        return {
          elements: elements,
          finisher: finisher
        };
      },
      runClassFinishers: function (constructor, finishers) {
        for (var i = 0; i < finishers.length; i++) {
          var newConstructor = (0, finishers[i])(constructor);

          if (newConstructor !== undefined) {
            if (typeof newConstructor !== "function") {
              throw new TypeError("Finishers must return a constructor.");
            }

            constructor = newConstructor;
          }
        }

        return constructor;
      },
      disallowProperty: function (obj, name, objectType) {
        if (obj[name] !== undefined) {
          throw new TypeError(objectType + " can't have a ." + name + " property.");
        }
      }
    };
    return api;
  }

  function _createElementDescriptor(def) {
    var key = _toPropertyKey(def.key);

    var descriptor;

    if (def.kind === "method") {
      descriptor = {
        value: def.value,
        writable: true,
        configurable: true,
        enumerable: false
      };
    } else if (def.kind === "get") {
      descriptor = {
        get: def.value,
        configurable: true,
        enumerable: false
      };
    } else if (def.kind === "set") {
      descriptor = {
        set: def.value,
        configurable: true,
        enumerable: false
      };
    } else if (def.kind === "field") {
      descriptor = {
        configurable: true,
        writable: true,
        enumerable: true
      };
    }

    var element = {
      kind: def.kind === "field" ? "field" : "method",
      key: key,
      placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype",
      descriptor: descriptor
    };
    if (def.decorators) element.decorators = def.decorators;
    if (def.kind === "field") element.initializer = def.value;
    return element;
  }

  function _coalesceGetterSetter(element, other) {
    if (element.descriptor.get !== undefined) {
      other.descriptor.get = element.descriptor.get;
    } else {
      other.descriptor.set = element.descriptor.set;
    }
  }

  function _coalesceClassElements(elements) {
    var newElements = [];

    var isSameElement = function (other) {
      return other.kind === "method" && other.key === element.key && other.placement === element.placement;
    };

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var other;

      if (element.kind === "method" && (other = newElements.find(isSameElement))) {
        if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
          if (_hasDecorators(element) || _hasDecorators(other)) {
            throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated.");
          }

          other.descriptor = element.descriptor;
        } else {
          if (_hasDecorators(element)) {
            if (_hasDecorators(other)) {
              throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ").");
            }

            other.decorators = element.decorators;
          }

          _coalesceGetterSetter(element, other);
        }
      } else {
        newElements.push(element);
      }
    }

    return newElements;
  }

  function _hasDecorators(element) {
    return element.decorators && element.decorators.length;
  }

  function _isDataDescriptor(desc) {
    return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
  }

  function _optionalCallableProperty(obj, name) {
    var value = obj[name];

    if (value !== undefined && typeof value !== "function") {
      throw new TypeError("Expected '" + name + "' to be a function");
    }

    return value;
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const directives = new WeakMap();
  const isDirective = o => {
    return typeof o === 'function' && directives.has(o);
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * True if the custom elements polyfill is in use.
   */
  const isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
  /**
   * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
   * `container`.
   */

  const removeNodes = (container, start, end = null) => {
    while (start !== end) {
      const n = start.nextSibling;
      container.removeChild(start);
      start = n;
    }
  };

  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * A sentinel value that signals that a value was handled by a directive and
   * should not be written to the DOM.
   */
  const noChange = {};
  /**
   * A sentinel value that signals a NodePart to fully clear its content.
   */

  const nothing = {};

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * An expression marker with embedded unique key to avoid collision with
   * possible text in templates.
   */
  const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
  /**
   * An expression marker used text-positions, multi-binding attributes, and
   * attributes with markup-like text values.
   */

  const nodeMarker = `<!--${marker}-->`;
  const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
  /**
   * Suffix appended to all bound attribute names.
   */

  const boundAttributeSuffix = '$lit$';
  /**
   * An updateable Template that tracks the location of dynamic parts.
   */

  class Template {
    constructor(result, element) {
      this.parts = [];
      this.element = element;
      const nodesToRemove = [];
      const stack = []; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

      const walker = document.createTreeWalker(element.content, 133
      /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
      , null, false); // Keeps track of the last index associated with a part. We try to delete
      // unnecessary nodes, but we never want to associate two different parts
      // to the same index. They must have a constant node between.

      let lastPartIndex = 0;
      let index = -1;
      let partIndex = 0;
      const {
        strings,
        values: {
          length
        }
      } = result;

      while (partIndex < length) {
        const node = walker.nextNode();

        if (node === null) {
          // We've exhausted the content inside a nested template element.
          // Because we still have parts (the outer for-loop), we know:
          // - There is a template in the stack
          // - The walker will find a nextNode outside the template
          walker.currentNode = stack.pop();
          continue;
        }

        index++;

        if (node.nodeType === 1
        /* Node.ELEMENT_NODE */
        ) {
            if (node.hasAttributes()) {
              const attributes = node.attributes;
              const {
                length
              } = attributes; // Per
              // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
              // attributes are not guaranteed to be returned in document order.
              // In particular, Edge/IE can return them out of order, so we cannot
              // assume a correspondence between part index and attribute index.

              let count = 0;

              for (let i = 0; i < length; i++) {
                if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                  count++;
                }
              }

              while (count-- > 0) {
                // Get the template literal section leading up to the first
                // expression in this attribute
                const stringForPart = strings[partIndex]; // Find the attribute name

                const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
                // All bound attributes have had a suffix added in
                // TemplateResult#getHTML to opt out of special attribute
                // handling. To look up the attribute value we also need to add
                // the suffix.

                const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                const attributeValue = node.getAttribute(attributeLookupName);
                node.removeAttribute(attributeLookupName);
                const statics = attributeValue.split(markerRegex);
                this.parts.push({
                  type: 'attribute',
                  index,
                  name,
                  strings: statics
                });
                partIndex += statics.length - 1;
              }
            }

            if (node.tagName === 'TEMPLATE') {
              stack.push(node);
              walker.currentNode = node.content;
            }
          } else if (node.nodeType === 3
        /* Node.TEXT_NODE */
        ) {
            const data = node.data;

            if (data.indexOf(marker) >= 0) {
              const parent = node.parentNode;
              const strings = data.split(markerRegex);
              const lastIndex = strings.length - 1; // Generate a new text node for each literal section
              // These nodes are also used as the markers for node parts

              for (let i = 0; i < lastIndex; i++) {
                let insert;
                let s = strings[i];

                if (s === '') {
                  insert = createMarker();
                } else {
                  const match = lastAttributeNameRegex.exec(s);

                  if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                    s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                  }

                  insert = document.createTextNode(s);
                }

                parent.insertBefore(insert, node);
                this.parts.push({
                  type: 'node',
                  index: ++index
                });
              } // If there's no text, we must insert a comment to mark our place.
              // Else, we can trust it will stick around after cloning.


              if (strings[lastIndex] === '') {
                parent.insertBefore(createMarker(), node);
                nodesToRemove.push(node);
              } else {
                node.data = strings[lastIndex];
              } // We have a part for each match found


              partIndex += lastIndex;
            }
          } else if (node.nodeType === 8
        /* Node.COMMENT_NODE */
        ) {
            if (node.data === marker) {
              const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
              // the following are true:
              //  * We don't have a previousSibling
              //  * The previousSibling is already the start of a previous part

              if (node.previousSibling === null || index === lastPartIndex) {
                index++;
                parent.insertBefore(createMarker(), node);
              }

              lastPartIndex = index;
              this.parts.push({
                type: 'node',
                index
              }); // If we don't have a nextSibling, keep this node so we have an end.
              // Else, we can remove it to save future costs.

              if (node.nextSibling === null) {
                node.data = '';
              } else {
                nodesToRemove.push(node);
                index--;
              }

              partIndex++;
            } else {
              let i = -1;

              while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                // Comment node has a binding marker inside, make an inactive part
                // The binding won't work, but subsequent bindings will
                // TODO (justinfagnani): consider whether it's even worth it to
                // make bindings in comments work
                this.parts.push({
                  type: 'node',
                  index: -1
                });
                partIndex++;
              }
            }
          }
      } // Remove text binding nodes after the walk to not disturb the TreeWalker


      for (const n of nodesToRemove) {
        n.parentNode.removeChild(n);
      }
    }

  }

  const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
  };

  const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
  // small manual size-savings.

  const createMarker = () => document.createComment('');
  /**
   * This regex extracts the attribute name preceding an attribute-position
   * expression. It does this by matching the syntax allowed for attributes
   * against the string literal directly preceding the expression, assuming that
   * the expression is in an attribute-value position.
   *
   * See attributes in the HTML spec:
   * https://www.w3.org/TR/html5/syntax.html#elements-attributes
   *
   * " \x09\x0a\x0c\x0d" are HTML space characters:
   * https://www.w3.org/TR/html5/infrastructure.html#space-characters
   *
   * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
   * space character except " ".
   *
   * So an attribute is:
   *  * The name: any character except a control character, space character, ('),
   *    ("), ">", "=", or "/"
   *  * Followed by zero or more space characters
   *  * Followed by "="
   *  * Followed by zero or more space characters
   *  * Followed by:
   *    * Any character except space, ('), ("), "<", ">", "=", (`), or
   *    * (") then any non-("), or
   *    * (') then any non-(')
   */

  const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * An instance of a `Template` that can be attached to the DOM and updated
   * with new values.
   */

  class TemplateInstance {
    constructor(template, processor, options) {
      this.__parts = [];
      this.template = template;
      this.processor = processor;
      this.options = options;
    }

    update(values) {
      let i = 0;

      for (const part of this.__parts) {
        if (part !== undefined) {
          part.setValue(values[i]);
        }

        i++;
      }

      for (const part of this.__parts) {
        if (part !== undefined) {
          part.commit();
        }
      }
    }

    _clone() {
      // There are a number of steps in the lifecycle of a template instance's
      // DOM fragment:
      //  1. Clone - create the instance fragment
      //  2. Adopt - adopt into the main document
      //  3. Process - find part markers and create parts
      //  4. Upgrade - upgrade custom elements
      //  5. Update - set node, attribute, property, etc., values
      //  6. Connect - connect to the document. Optional and outside of this
      //     method.
      //
      // We have a few constraints on the ordering of these steps:
      //  * We need to upgrade before updating, so that property values will pass
      //    through any property setters.
      //  * We would like to process before upgrading so that we're sure that the
      //    cloned fragment is inert and not disturbed by self-modifying DOM.
      //  * We want custom elements to upgrade even in disconnected fragments.
      //
      // Given these constraints, with full custom elements support we would
      // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
      //
      // But Safari dooes not implement CustomElementRegistry#upgrade, so we
      // can not implement that order and still have upgrade-before-update and
      // upgrade disconnected fragments. So we instead sacrifice the
      // process-before-upgrade constraint, since in Custom Elements v1 elements
      // must not modify their light DOM in the constructor. We still have issues
      // when co-existing with CEv0 elements like Polymer 1, and with polyfills
      // that don't strictly adhere to the no-modification rule because shadow
      // DOM, which may be created in the constructor, is emulated by being placed
      // in the light DOM.
      //
      // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
      // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
      // in one step.
      //
      // The Custom Elements v1 polyfill supports upgrade(), so the order when
      // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
      // Connect.
      const fragment = isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
      const stack = [];
      const parts = this.template.parts; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

      const walker = document.createTreeWalker(fragment, 133
      /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
      , null, false);
      let partIndex = 0;
      let nodeIndex = 0;
      let part;
      let node = walker.nextNode(); // Loop through all the nodes and parts of a template

      while (partIndex < parts.length) {
        part = parts[partIndex];

        if (!isTemplatePartActive(part)) {
          this.__parts.push(undefined);

          partIndex++;
          continue;
        } // Progress the tree walker until we find our next part's node.
        // Note that multiple parts may share the same node (attribute parts
        // on a single element), so this loop may not run at all.


        while (nodeIndex < part.index) {
          nodeIndex++;

          if (node.nodeName === 'TEMPLATE') {
            stack.push(node);
            walker.currentNode = node.content;
          }

          if ((node = walker.nextNode()) === null) {
            // We've exhausted the content inside a nested template element.
            // Because we still have parts (the outer for-loop), we know:
            // - There is a template in the stack
            // - The walker will find a nextNode outside the template
            walker.currentNode = stack.pop();
            node = walker.nextNode();
          }
        } // We've arrived at our part's node.


        if (part.type === 'node') {
          const part = this.processor.handleTextExpression(this.options);
          part.insertAfterNode(node.previousSibling);

          this.__parts.push(part);
        } else {
          this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
        }

        partIndex++;
      }

      if (isCEPolyfill) {
        document.adoptNode(fragment);
        customElements.upgrade(fragment);
      }

      return fragment;
    }

  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * The return type of `html`, which holds a Template and the values from
   * interpolated expressions.
   */

  class TemplateResult {
    constructor(strings, values, type, processor) {
      this.strings = strings;
      this.values = values;
      this.type = type;
      this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */


    getHTML() {
      const l = this.strings.length - 1;
      let html = '';
      let isCommentBinding = false;

      for (let i = 0; i < l; i++) {
        const s = this.strings[i]; // For each binding we want to determine the kind of marker to insert
        // into the template source before it's parsed by the browser's HTML
        // parser. The marker type is based on whether the expression is in an
        // attribute, text, or comment poisition.
        //   * For node-position bindings we insert a comment with the marker
        //     sentinel as its text content, like <!--{{lit-guid}}-->.
        //   * For attribute bindings we insert just the marker sentinel for the
        //     first binding, so that we support unquoted attribute bindings.
        //     Subsequent bindings can use a comment marker because multi-binding
        //     attributes must be quoted.
        //   * For comment bindings we insert just the marker sentinel so we don't
        //     close the comment.
        //
        // The following code scans the template source, but is *not* an HTML
        // parser. We don't need to track the tree structure of the HTML, only
        // whether a binding is inside a comment, and if not, if it appears to be
        // the first binding in an attribute.

        const commentOpen = s.lastIndexOf('<!--'); // We're in comment position if we have a comment open with no following
        // comment close. Because <-- can appear in an attribute value there can
        // be false positives.

        isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf('-->', commentOpen + 1) === -1; // Check to see if we have an attribute-like sequence preceeding the
        // expression. This can match "name=value" like structures in text,
        // comments, and attribute values, so there can be false-positives.

        const attributeMatch = lastAttributeNameRegex.exec(s);

        if (attributeMatch === null) {
          // We're only in this branch if we don't have a attribute-like
          // preceeding sequence. For comments, this guards against unusual
          // attribute values like <div foo="<!--${'bar'}">. Cases like
          // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
          // below.
          html += s + (isCommentBinding ? marker : nodeMarker);
        } else {
          // For attributes we use just a marker sentinel, and also append a
          // $lit$ suffix to the name to opt-out of attribute-specific parsing
          // that IE and Edge do for style and certain SVG attributes.
          html += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] + marker;
        }
      }

      html += this.strings[l];
      return html;
    }

    getTemplateElement() {
      const template = document.createElement('template');
      template.innerHTML = this.getHTML();
      return template;
    }

  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const isPrimitive = value => {
    return value === null || !(typeof value === 'object' || typeof value === 'function');
  };
  const isIterable = value => {
    return Array.isArray(value) || // tslint:disable-next-line:no-any
    !!(value && value[Symbol.iterator]);
  };
  /**
   * Writes attribute values to the DOM for a group of AttributeParts bound to a
   * single attibute. The value is only set once even if there are multiple parts
   * for an attribute.
   */

  class AttributeCommitter {
    constructor(element, name, strings) {
      this.dirty = true;
      this.element = element;
      this.name = name;
      this.strings = strings;
      this.parts = [];

      for (let i = 0; i < strings.length - 1; i++) {
        this.parts[i] = this._createPart();
      }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */


    _createPart() {
      return new AttributePart(this);
    }

    _getValue() {
      const strings = this.strings;
      const l = strings.length - 1;
      let text = '';

      for (let i = 0; i < l; i++) {
        text += strings[i];
        const part = this.parts[i];

        if (part !== undefined) {
          const v = part.value;

          if (isPrimitive(v) || !isIterable(v)) {
            text += typeof v === 'string' ? v : String(v);
          } else {
            for (const t of v) {
              text += typeof t === 'string' ? t : String(t);
            }
          }
        }
      }

      text += strings[l];
      return text;
    }

    commit() {
      if (this.dirty) {
        this.dirty = false;
        this.element.setAttribute(this.name, this._getValue());
      }
    }

  }
  /**
   * A Part that controls all or part of an attribute value.
   */

  class AttributePart {
    constructor(committer) {
      this.value = undefined;
      this.committer = committer;
    }

    setValue(value) {
      if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
        this.value = value; // If the value is a not a directive, dirty the committer so that it'll
        // call setAttribute. If the value is a directive, it'll dirty the
        // committer if it calls setValue().

        if (!isDirective(value)) {
          this.committer.dirty = true;
        }
      }
    }

    commit() {
      while (isDirective(this.value)) {
        const directive = this.value;
        this.value = noChange;
        directive(this);
      }

      if (this.value === noChange) {
        return;
      }

      this.committer.commit();
    }

  }
  /**
   * A Part that controls a location within a Node tree. Like a Range, NodePart
   * has start and end locations and can set and update the Nodes between those
   * locations.
   *
   * NodeParts support several value types: primitives, Nodes, TemplateResults,
   * as well as arrays and iterables of those types.
   */

  class NodePart {
    constructor(options) {
      this.value = undefined;
      this.__pendingValue = undefined;
      this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    appendInto(container) {
      this.startNode = container.appendChild(createMarker());
      this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    insertAfterNode(ref) {
      this.startNode = ref;
      this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    appendIntoPart(part) {
      part.__insert(this.startNode = createMarker());

      part.__insert(this.endNode = createMarker());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    insertAfterPart(ref) {
      ref.__insert(this.startNode = createMarker());

      this.endNode = ref.endNode;
      ref.endNode = this.startNode;
    }

    setValue(value) {
      this.__pendingValue = value;
    }

    commit() {
      while (isDirective(this.__pendingValue)) {
        const directive = this.__pendingValue;
        this.__pendingValue = noChange;
        directive(this);
      }

      const value = this.__pendingValue;

      if (value === noChange) {
        return;
      }

      if (isPrimitive(value)) {
        if (value !== this.value) {
          this.__commitText(value);
        }
      } else if (value instanceof TemplateResult) {
        this.__commitTemplateResult(value);
      } else if (value instanceof Node) {
        this.__commitNode(value);
      } else if (isIterable(value)) {
        this.__commitIterable(value);
      } else if (value === nothing) {
        this.value = nothing;
        this.clear();
      } else {
        // Fallback, will render the string representation
        this.__commitText(value);
      }
    }

    __insert(node) {
      this.endNode.parentNode.insertBefore(node, this.endNode);
    }

    __commitNode(value) {
      if (this.value === value) {
        return;
      }

      this.clear();

      this.__insert(value);

      this.value = value;
    }

    __commitText(value) {
      const node = this.startNode.nextSibling;
      value = value == null ? '' : value; // If `value` isn't already a string, we explicitly convert it here in case
      // it can't be implicitly converted - i.e. it's a symbol.

      const valueAsString = typeof value === 'string' ? value : String(value);

      if (node === this.endNode.previousSibling && node.nodeType === 3
      /* Node.TEXT_NODE */
      ) {
          // If we only have a single text node between the markers, we can just
          // set its value, rather than replacing it.
          // TODO(justinfagnani): Can we just check if this.value is primitive?
          node.data = valueAsString;
        } else {
        this.__commitNode(document.createTextNode(valueAsString));
      }

      this.value = value;
    }

    __commitTemplateResult(value) {
      const template = this.options.templateFactory(value);

      if (this.value instanceof TemplateInstance && this.value.template === template) {
        this.value.update(value.values);
      } else {
        // Make sure we propagate the template processor from the TemplateResult
        // so that we use its syntax extension, etc. The template factory comes
        // from the render function options so that it can control template
        // caching and preprocessing.
        const instance = new TemplateInstance(template, value.processor, this.options);

        const fragment = instance._clone();

        instance.update(value.values);

        this.__commitNode(fragment);

        this.value = instance;
      }
    }

    __commitIterable(value) {
      // For an Iterable, we create a new InstancePart per item, then set its
      // value to the item. This is a little bit of overhead for every item in
      // an Iterable, but it lets us recurse easily and efficiently update Arrays
      // of TemplateResults that will be commonly returned from expressions like:
      // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
      // If _value is an array, then the previous render was of an
      // iterable and _value will contain the NodeParts from the previous
      // render. If _value is not an array, clear this part and make a new
      // array for NodeParts.
      if (!Array.isArray(this.value)) {
        this.value = [];
        this.clear();
      } // Lets us keep track of how many items we stamped so we can clear leftover
      // items from a previous render


      const itemParts = this.value;
      let partIndex = 0;
      let itemPart;

      for (const item of value) {
        // Try to reuse an existing part
        itemPart = itemParts[partIndex]; // If no existing part, create a new one

        if (itemPart === undefined) {
          itemPart = new NodePart(this.options);
          itemParts.push(itemPart);

          if (partIndex === 0) {
            itemPart.appendIntoPart(this);
          } else {
            itemPart.insertAfterPart(itemParts[partIndex - 1]);
          }
        }

        itemPart.setValue(item);
        itemPart.commit();
        partIndex++;
      }

      if (partIndex < itemParts.length) {
        // Truncate the parts array so _value reflects the current state
        itemParts.length = partIndex;
        this.clear(itemPart && itemPart.endNode);
      }
    }

    clear(startNode = this.startNode) {
      removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }

  }
  /**
   * Implements a boolean attribute, roughly as defined in the HTML
   * specification.
   *
   * If the value is truthy, then the attribute is present with a value of
   * ''. If the value is falsey, the attribute is removed.
   */

  class BooleanAttributePart {
    constructor(element, name, strings) {
      this.value = undefined;
      this.__pendingValue = undefined;

      if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
        throw new Error('Boolean attributes can only contain a single expression');
      }

      this.element = element;
      this.name = name;
      this.strings = strings;
    }

    setValue(value) {
      this.__pendingValue = value;
    }

    commit() {
      while (isDirective(this.__pendingValue)) {
        const directive = this.__pendingValue;
        this.__pendingValue = noChange;
        directive(this);
      }

      if (this.__pendingValue === noChange) {
        return;
      }

      const value = !!this.__pendingValue;

      if (this.value !== value) {
        if (value) {
          this.element.setAttribute(this.name, '');
        } else {
          this.element.removeAttribute(this.name);
        }

        this.value = value;
      }

      this.__pendingValue = noChange;
    }

  }
  /**
   * Sets attribute values for PropertyParts, so that the value is only set once
   * even if there are multiple parts for a property.
   *
   * If an expression controls the whole property value, then the value is simply
   * assigned to the property under control. If there are string literals or
   * multiple expressions, then the strings are expressions are interpolated into
   * a string first.
   */

  class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
      super(element, name, strings);
      this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
    }

    _createPart() {
      return new PropertyPart(this);
    }

    _getValue() {
      if (this.single) {
        return this.parts[0].value;
      }

      return super._getValue();
    }

    commit() {
      if (this.dirty) {
        this.dirty = false; // tslint:disable-next-line:no-any

        this.element[this.name] = this._getValue();
      }
    }

  }
  class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
  // from the options object, then options are supported. If not, then the thrid
  // argument to add/removeEventListener is interpreted as the boolean capture
  // value so we should only pass the `capture` property.

  let eventOptionsSupported = false;

  try {
    const options = {
      get capture() {
        eventOptionsSupported = true;
        return false;
      }

    }; // tslint:disable-next-line:no-any

    window.addEventListener('test', options, options); // tslint:disable-next-line:no-any

    window.removeEventListener('test', options, options);
  } catch (_e) {}

  class EventPart {
    constructor(element, eventName, eventContext) {
      this.value = undefined;
      this.__pendingValue = undefined;
      this.element = element;
      this.eventName = eventName;
      this.eventContext = eventContext;

      this.__boundHandleEvent = e => this.handleEvent(e);
    }

    setValue(value) {
      this.__pendingValue = value;
    }

    commit() {
      while (isDirective(this.__pendingValue)) {
        const directive = this.__pendingValue;
        this.__pendingValue = noChange;
        directive(this);
      }

      if (this.__pendingValue === noChange) {
        return;
      }

      const newListener = this.__pendingValue;
      const oldListener = this.value;
      const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
      const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

      if (shouldRemoveListener) {
        this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
      }

      if (shouldAddListener) {
        this.__options = getOptions(newListener);
        this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
      }

      this.value = newListener;
      this.__pendingValue = noChange;
    }

    handleEvent(event) {
      if (typeof this.value === 'function') {
        this.value.call(this.eventContext || this.element, event);
      } else {
        this.value.handleEvent(event);
      }
    }

  } // We copy options because of the inconsistent behavior of browsers when reading
  // the third argument of add/removeEventListener. IE11 doesn't support options
  // at all. Chrome 41 only reads `capture` if the argument is an object.

  const getOptions = o => o && (eventOptionsSupported ? {
    capture: o.capture,
    passive: o.passive,
    once: o.once
  } : o.capture);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * Creates Parts when a template is instantiated.
   */

  class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
      const prefix = name[0];

      if (prefix === '.') {
        const committer = new PropertyCommitter(element, name.slice(1), strings);
        return committer.parts;
      }

      if (prefix === '@') {
        return [new EventPart(element, name.slice(1), options.eventContext)];
      }

      if (prefix === '?') {
        return [new BooleanAttributePart(element, name.slice(1), strings)];
      }

      const committer = new AttributeCommitter(element, name, strings);
      return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */


    handleTextExpression(options) {
      return new NodePart(options);
    }

  }
  const defaultTemplateProcessor = new DefaultTemplateProcessor();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * The default TemplateFactory which caches Templates keyed on
   * result.type and result.strings.
   */

  function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);

    if (templateCache === undefined) {
      templateCache = {
        stringsArray: new WeakMap(),
        keyString: new Map()
      };
      templateCaches.set(result.type, templateCache);
    }

    let template = templateCache.stringsArray.get(result.strings);

    if (template !== undefined) {
      return template;
    } // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content


    const key = result.strings.join(marker); // Check if we already have a Template for this key

    template = templateCache.keyString.get(key);

    if (template === undefined) {
      // If we have not seen this key before, create a new Template
      template = new Template(result, result.getTemplateElement()); // Cache the Template for this key

      templateCache.keyString.set(key, template);
    } // Cache all future queries for this TemplateStringsArray


    templateCache.stringsArray.set(result.strings, template);
    return template;
  }
  const templateCaches = new Map();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const parts = new WeakMap();
  /**
   * Renders a template result or other value to a container.
   *
   * To update a container with new values, reevaluate the template literal and
   * call `render` with the new result.
   *
   * @param result Any value renderable by NodePart - typically a TemplateResult
   *     created by evaluating a template tag like `html` or `svg`.
   * @param container A DOM parent to render to. The entire contents are either
   *     replaced, or efficiently updated if the same result type was previous
   *     rendered there.
   * @param options RenderOptions for the entire render tree rendered to this
   *     container. Render options must *not* change between renders to the same
   *     container, as those changes will not effect previously rendered DOM.
   */

  const render = (result, container, options) => {
    let part = parts.get(container);

    if (part === undefined) {
      removeNodes(container, container.firstChild);
      parts.set(container, part = new NodePart(Object.assign({
        templateFactory
      }, options)));
      part.appendInto(container);
    }

    part.setValue(result);
    part.commit();
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // This line will be used in regexes to search for lit-html usage.
  // TODO(justinfagnani): inject version number at build time

  (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.1');
  /**
   * Interprets a template literal as an HTML template that can efficiently
   * render to and update a container.
   */

  const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const walkerNodeFilter = 133
  /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
  ;
  /**
   * Removes the list of nodes from a Template safely. In addition to removing
   * nodes from the Template, the Template part indices are updated to match
   * the mutated Template DOM.
   *
   * As the template is walked the removal state is tracked and
   * part indices are adjusted as needed.
   *
   * div
   *   div#1 (remove) <-- start removing (removing node is div#1)
   *     div
   *       div#2 (remove)  <-- continue removing (removing node is still div#1)
   *         div
   * div <-- stop removing since previous sibling is the removing node (div#1,
   * removed 4 nodes)
   */

  function removeNodesFromTemplate(template, nodesToRemove) {
    const {
      element: {
        content
      },
      parts
    } = template;
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let part = parts[partIndex];
    let nodeIndex = -1;
    let removeCount = 0;
    const nodesToRemoveInTemplate = [];
    let currentRemovingNode = null;

    while (walker.nextNode()) {
      nodeIndex++;
      const node = walker.currentNode; // End removal if stepped past the removing node

      if (node.previousSibling === currentRemovingNode) {
        currentRemovingNode = null;
      } // A node to remove was found in the template


      if (nodesToRemove.has(node)) {
        nodesToRemoveInTemplate.push(node); // Track node we're removing

        if (currentRemovingNode === null) {
          currentRemovingNode = node;
        }
      } // When removing, increment count by which to adjust subsequent part indices


      if (currentRemovingNode !== null) {
        removeCount++;
      }

      while (part !== undefined && part.index === nodeIndex) {
        // If part is in a removed node deactivate it by setting index to -1 or
        // adjust the index as needed.
        part.index = currentRemovingNode !== null ? -1 : part.index - removeCount; // go to the next active part.

        partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        part = parts[partIndex];
      }
    }

    nodesToRemoveInTemplate.forEach(n => n.parentNode.removeChild(n));
  }

  const countNodes = node => {
    let count = node.nodeType === 11
    /* Node.DOCUMENT_FRAGMENT_NODE */
    ? 0 : 1;
    const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);

    while (walker.nextNode()) {
      count++;
    }

    return count;
  };

  const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
    for (let i = startIndex + 1; i < parts.length; i++) {
      const part = parts[i];

      if (isTemplatePartActive(part)) {
        return i;
      }
    }

    return -1;
  };
  /**
   * Inserts the given node into the Template, optionally before the given
   * refNode. In addition to inserting the node into the Template, the Template
   * part indices are updated to match the mutated Template DOM.
   */


  function insertNodeIntoTemplate(template, node, refNode = null) {
    const {
      element: {
        content
      },
      parts
    } = template; // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.

    if (refNode === null || refNode === undefined) {
      content.appendChild(node);
      return;
    }

    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let insertCount = 0;
    let walkerIndex = -1;

    while (walker.nextNode()) {
      walkerIndex++;
      const walkerNode = walker.currentNode;

      if (walkerNode === refNode) {
        insertCount = countNodes(node);
        refNode.parentNode.insertBefore(node, refNode);
      }

      while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
        // If we've inserted the node, simply adjust all subsequent parts
        if (insertCount > 0) {
          while (partIndex !== -1) {
            parts[partIndex].index += insertCount;
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
          }

          return;
        }

        partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
      }
    }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;

  let compatibleShadyCSSVersion = true;

  if (typeof window.ShadyCSS === 'undefined') {
    compatibleShadyCSSVersion = false;
  } else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected. ` + `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` + `@webcomponents/shadycss@1.3.1.`);
    compatibleShadyCSSVersion = false;
  }
  /**
   * Template factory which scopes template DOM using ShadyCSS.
   * @param scopeName {string}
   */


  const shadyTemplateFactory = scopeName => result => {
    const cacheKey = getTemplateCacheKey(result.type, scopeName);
    let templateCache = templateCaches.get(cacheKey);

    if (templateCache === undefined) {
      templateCache = {
        stringsArray: new WeakMap(),
        keyString: new Map()
      };
      templateCaches.set(cacheKey, templateCache);
    }

    let template = templateCache.stringsArray.get(result.strings);

    if (template !== undefined) {
      return template;
    }

    const key = result.strings.join(marker);
    template = templateCache.keyString.get(key);

    if (template === undefined) {
      const element = result.getTemplateElement();

      if (compatibleShadyCSSVersion) {
        window.ShadyCSS.prepareTemplateDom(element, scopeName);
      }

      template = new Template(result, element);
      templateCache.keyString.set(key, template);
    }

    templateCache.stringsArray.set(result.strings, template);
    return template;
  };

  const TEMPLATE_TYPES = ['html', 'svg'];
  /**
   * Removes all style elements from Templates for the given scopeName.
   */

  const removeStylesFromLitTemplates = scopeName => {
    TEMPLATE_TYPES.forEach(type => {
      const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));

      if (templates !== undefined) {
        templates.keyString.forEach(template => {
          const {
            element: {
              content
            }
          } = template; // IE 11 doesn't support the iterable param Set constructor

          const styles = new Set();
          Array.from(content.querySelectorAll('style')).forEach(s => {
            styles.add(s);
          });
          removeNodesFromTemplate(template, styles);
        });
      }
    });
  };

  const shadyRenderSet = new Set();
  /**
   * For the given scope name, ensures that ShadyCSS style scoping is performed.
   * This is done just once per scope name so the fragment and template cannot
   * be modified.
   * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
   * to be scoped and appended to the document
   * (2) removes style elements from all lit-html Templates for this scope name.
   *
   * Note, <style> elements can only be placed into templates for the
   * initial rendering of the scope. If <style> elements are included in templates
   * dynamically rendered to the scope (after the first scope render), they will
   * not be scoped and the <style> will be left in the template and rendered
   * output.
   */

  const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
    shadyRenderSet.add(scopeName); // If `renderedDOM` is stamped from a Template, then we need to edit that
    // Template's underlying template element. Otherwise, we create one here
    // to give to ShadyCSS, which still requires one while scoping.

    const templateElement = !!template ? template.element : document.createElement('template'); // Move styles out of rendered DOM and store.

    const styles = renderedDOM.querySelectorAll('style');
    const {
      length
    } = styles; // If there are no styles, skip unnecessary work

    if (length === 0) {
      // Ensure prepareTemplateStyles is called to support adding
      // styles via `prepareAdoptedCssText` since that requires that
      // `prepareTemplateStyles` is called.
      //
      // ShadyCSS will only update styles containing @apply in the template
      // given to `prepareTemplateStyles`. If no lit Template was given,
      // ShadyCSS will not be able to update uses of @apply in any relevant
      // template. However, this is not a problem because we only create the
      // template for the purpose of supporting `prepareAdoptedCssText`,
      // which doesn't support @apply at all.
      window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
      return;
    }

    const condensedStyle = document.createElement('style'); // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.

    for (let i = 0; i < length; i++) {
      const style = styles[i];
      style.parentNode.removeChild(style);
      condensedStyle.textContent += style.textContent;
    } // Remove styles from nested templates in this scope.


    removeStylesFromLitTemplates(scopeName); // And then put the condensed style into the "root" template passed in as
    // `template`.

    const content = templateElement.content;

    if (!!template) {
      insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
    } else {
      content.insertBefore(condensedStyle, content.firstChild);
    } // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).


    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    const style = content.querySelector('style');

    if (window.ShadyCSS.nativeShadow && style !== null) {
      // When in native Shadow DOM, ensure the style created by ShadyCSS is
      // included in initially rendered output (`renderedDOM`).
      renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
    } else if (!!template) {
      // When no style is left in the template, parts will be broken as a
      // result. To fix this, we put back the style node ShadyCSS removed
      // and then tell lit to remove that node from the template.
      // There can be no style in the template in 2 cases (1) when Shady DOM
      // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
      // is in use ShadyCSS removes the style if it contains no content.
      // NOTE, ShadyCSS creates its own style so we can safely add/remove
      // `condensedStyle` here.
      content.insertBefore(condensedStyle, content.firstChild);
      const removes = new Set();
      removes.add(condensedStyle);
      removeNodesFromTemplate(template, removes);
    }
  };
  /**
   * Extension to the standard `render` method which supports rendering
   * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
   * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
   * or when the webcomponentsjs
   * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
   *
   * Adds a `scopeName` option which is used to scope element DOM and stylesheets
   * when native ShadowDOM is unavailable. The `scopeName` will be added to
   * the class attribute of all rendered DOM. In addition, any style elements will
   * be automatically re-written with this `scopeName` selector and moved out
   * of the rendered DOM and into the document `<head>`.
   *
   * It is common to use this render method in conjunction with a custom element
   * which renders a shadowRoot. When this is done, typically the element's
   * `localName` should be used as the `scopeName`.
   *
   * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
   * custom properties (needed only on older browsers like IE11) and a shim for
   * a deprecated feature called `@apply` that supports applying a set of css
   * custom properties to a given location.
   *
   * Usage considerations:
   *
   * * Part values in `<style>` elements are only applied the first time a given
   * `scopeName` renders. Subsequent changes to parts in style elements will have
   * no effect. Because of this, parts in style elements should only be used for
   * values that will never change, for example parts that set scope-wide theme
   * values or parts which render shared style elements.
   *
   * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
   * custom element's `constructor` is not supported. Instead rendering should
   * either done asynchronously, for example at microtask timing (for example
   * `Promise.resolve()`), or be deferred until the first time the element's
   * `connectedCallback` runs.
   *
   * Usage considerations when using shimmed custom properties or `@apply`:
   *
   * * Whenever any dynamic changes are made which affect
   * css custom properties, `ShadyCSS.styleElement(element)` must be called
   * to update the element. There are two cases when this is needed:
   * (1) the element is connected to a new parent, (2) a class is added to the
   * element that causes it to match different custom properties.
   * To address the first case when rendering a custom element, `styleElement`
   * should be called in the element's `connectedCallback`.
   *
   * * Shimmed custom properties may only be defined either for an entire
   * shadowRoot (for example, in a `:host` rule) or via a rule that directly
   * matches an element with a shadowRoot. In other words, instead of flowing from
   * parent to child as do native css custom properties, shimmed custom properties
   * flow only from shadowRoots to nested shadowRoots.
   *
   * * When using `@apply` mixing css shorthand property names with
   * non-shorthand names (for example `border` and `border-width`) is not
   * supported.
   */


  const render$1 = (result, container, options) => {
    if (!options || typeof options !== 'object' || !options.scopeName) {
      throw new Error('The `scopeName` option is required.');
    }

    const scopeName = options.scopeName;
    const hasRendered = parts.has(container);
    const needsScoping = compatibleShadyCSSVersion && container.nodeType === 11
    /* Node.DOCUMENT_FRAGMENT_NODE */
    && !!container.host; // Handle first render to a scope specially...

    const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName); // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.

    const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
    render(result, renderContainer, Object.assign({
      templateFactory: shadyTemplateFactory(scopeName)
    }, options)); // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.

    if (firstScopeRender) {
      const part = parts.get(renderContainer);
      parts.delete(renderContainer); // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
      // that should apply to `renderContainer` even if the rendered value is
      // not a TemplateInstance. However, it will only insert scoped styles
      // into the document if `prepareTemplateStyles` has already been called
      // for the given scope name.

      const template = part.value instanceof TemplateInstance ? part.value.template : undefined;
      prepareTemplateStyles(scopeName, renderContainer, template);
      removeNodes(container, container.firstChild);
      container.appendChild(renderContainer);
      parts.set(container, part);
    } // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSS.styleElement`
    // for dynamic changes.


    if (!hasRendered && needsScoping) {
      window.ShadyCSS.styleElement(container.host);
    }
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var _a;
  /**
   * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
   * replaced at compile time by the munged name for object[property]. We cannot
   * alias this function, so we have to use a small shim that has the same
   * behavior when not compiling.
   */


  window.JSCompiler_renameProperty = (prop, _obj) => prop;

  const defaultConverter = {
    toAttribute(value, type) {
      switch (type) {
        case Boolean:
          return value ? '' : null;

        case Object:
        case Array:
          // if the value is `null` or `undefined` pass this through
          // to allow removing/no change behavior.
          return value == null ? value : JSON.stringify(value);
      }

      return value;
    },

    fromAttribute(value, type) {
      switch (type) {
        case Boolean:
          return value !== null;

        case Number:
          return value === null ? null : Number(value);

        case Object:
        case Array:
          return JSON.parse(value);
      }

      return value;
    }

  };
  /**
   * Change function that returns true if `value` is different from `oldValue`.
   * This method is used as the default for a property's `hasChanged` function.
   */

  const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
  };
  const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
  };
  const microtaskPromise = Promise.resolve(true);
  const STATE_HAS_UPDATED = 1;
  const STATE_UPDATE_REQUESTED = 1 << 2;
  const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
  const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
  const STATE_HAS_CONNECTED = 1 << 5;
  /**
   * The Closure JS Compiler doesn't currently have good support for static
   * property semantics where "this" is dynamic (e.g.
   * https://github.com/google/closure-compiler/issues/3177 and others) so we use
   * this hack to bypass any rewriting by the compiler.
   */

  const finalized = 'finalized';
  /**
   * Base element class which manages element properties and attributes. When
   * properties change, the `update` method is asynchronously called. This method
   * should be supplied by subclassers to render updates as desired.
   */

  class UpdatingElement extends HTMLElement {
    constructor() {
      super();
      this._updateState = 0;
      this._instanceProperties = undefined;
      this._updatePromise = microtaskPromise;
      this._hasConnectedResolver = undefined;
      /**
       * Map with keys for any properties that have changed since the last
       * update cycle with previous values.
       */

      this._changedProperties = new Map();
      /**
       * Map with keys of properties that should be reflected when updated.
       */

      this._reflectingProperties = undefined;
      this.initialize();
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */


    static get observedAttributes() {
      // note: piggy backing on this to ensure we're finalized.
      this.finalize();
      const attributes = []; // Use forEach so this works even if for/of loops are compiled to for loops
      // expecting arrays

      this._classProperties.forEach((v, p) => {
        const attr = this._attributeNameForProperty(p, v);

        if (attr !== undefined) {
          this._attributeToPropertyMap.set(attr, p);

          attributes.push(attr);
        }
      });

      return attributes;
    }
    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */

    /** @nocollapse */


    static _ensureClassProperties() {
      // ensure private storage for property declarations.
      if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
        this._classProperties = new Map(); // NOTE: Workaround IE11 not supporting Map constructor argument.

        const superProperties = Object.getPrototypeOf(this)._classProperties;

        if (superProperties !== undefined) {
          superProperties.forEach((v, k) => this._classProperties.set(k, v));
        }
      }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     * @nocollapse
     */


    static createProperty(name, options = defaultPropertyDeclaration) {
      // Note, since this can be called by the `@property` decorator which
      // is called before `finalize`, we ensure storage exists for property
      // metadata.
      this._ensureClassProperties();

      this._classProperties.set(name, options); // Do not generate an accessor if the prototype already has one, since
      // it would be lost otherwise and that would never be the user's intention;
      // Instead, we expect users to call `requestUpdate` themselves from
      // user-defined accessors. Note that if the super has an accessor we will
      // still overwrite it


      if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
        return;
      }

      const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
      Object.defineProperty(this.prototype, name, {
        // tslint:disable-next-line:no-any no symbol in index
        get() {
          return this[key];
        },

        set(value) {
          const oldValue = this[name];
          this[key] = value;

          this._requestUpdate(name, oldValue);
        },

        configurable: true,
        enumerable: true
      });
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */


    static finalize() {
      // finalize any superclasses
      const superCtor = Object.getPrototypeOf(this);

      if (!superCtor.hasOwnProperty(finalized)) {
        superCtor.finalize();
      }

      this[finalized] = true;

      this._ensureClassProperties(); // initialize Map populated in observedAttributes


      this._attributeToPropertyMap = new Map(); // make any properties
      // Note, only process "own" properties since this element will inherit
      // any properties defined on the superClass, and finalization ensures
      // the entire prototype chain is finalized.

      if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
        const props = this.properties; // support symbols in properties (IE11 does not support this)

        const propKeys = [...Object.getOwnPropertyNames(props), ...(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(props) : [])]; // This for/of is ok because propKeys is an array

        for (const p of propKeys) {
          // note, use of `any` is due to TypeSript lack of support for symbol in
          // index types
          // tslint:disable-next-line:no-any no symbol in index
          this.createProperty(p, props[p]);
        }
      }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */


    static _attributeNameForProperty(name, options) {
      const attribute = options.attribute;
      return attribute === false ? undefined : typeof attribute === 'string' ? attribute : typeof name === 'string' ? name.toLowerCase() : undefined;
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */


    static _valueHasChanged(value, old, hasChanged = notEqual) {
      return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */


    static _propertyValueFromAttribute(value, options) {
      const type = options.type;
      const converter = options.converter || defaultConverter;
      const fromAttribute = typeof converter === 'function' ? converter : converter.fromAttribute;
      return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */


    static _propertyValueToAttribute(value, options) {
      if (options.reflect === undefined) {
        return;
      }

      const type = options.type;
      const converter = options.converter;
      const toAttribute = converter && converter.toAttribute || defaultConverter.toAttribute;
      return toAttribute(value, type);
    }
    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */


    initialize() {
      this._saveInstanceProperties(); // ensures first update will be caught by an early access of
      // `updateComplete`


      this._requestUpdate();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */


    _saveInstanceProperties() {
      // Use forEach so this works even if for/of loops are compiled to for loops
      // expecting arrays
      this.constructor._classProperties.forEach((_v, p) => {
        if (this.hasOwnProperty(p)) {
          const value = this[p];
          delete this[p];

          if (!this._instanceProperties) {
            this._instanceProperties = new Map();
          }

          this._instanceProperties.set(p, value);
        }
      });
    }
    /**
     * Applies previously saved instance properties.
     */


    _applyInstanceProperties() {
      // Use forEach so this works even if for/of loops are compiled to for loops
      // expecting arrays
      // tslint:disable-next-line:no-any
      this._instanceProperties.forEach((v, p) => this[p] = v);

      this._instanceProperties = undefined;
    }

    connectedCallback() {
      this._updateState = this._updateState | STATE_HAS_CONNECTED; // Ensure first connection completes an update. Updates cannot complete
      // before connection and if one is pending connection the
      // `_hasConnectionResolver` will exist. If so, resolve it to complete the
      // update, otherwise requestUpdate.

      if (this._hasConnectedResolver) {
        this._hasConnectedResolver();

        this._hasConnectedResolver = undefined;
      }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */


    disconnectedCallback() {}
    /**
     * Synchronizes property values when attributes change.
     */


    attributeChangedCallback(name, old, value) {
      if (old !== value) {
        this._attributeToProperty(name, value);
      }
    }

    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
      const ctor = this.constructor;

      const attr = ctor._attributeNameForProperty(name, options);

      if (attr !== undefined) {
        const attrValue = ctor._propertyValueToAttribute(value, options); // an undefined value does not change the attribute.


        if (attrValue === undefined) {
          return;
        } // Track if the property is being reflected to avoid
        // setting the property again via `attributeChangedCallback`. Note:
        // 1. this takes advantage of the fact that the callback is synchronous.
        // 2. will behave incorrectly if multiple attributes are in the reaction
        // stack at time of calling. However, since we process attributes
        // in `update` this should not be possible (or an extreme corner case
        // that we'd like to discover).
        // mark state reflecting


        this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;

        if (attrValue == null) {
          this.removeAttribute(attr);
        } else {
          this.setAttribute(attr, attrValue);
        } // mark state not reflecting


        this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
      }
    }

    _attributeToProperty(name, value) {
      // Use tracking info to avoid deserializing attribute value if it was
      // just set from a property setter.
      if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
        return;
      }

      const ctor = this.constructor;

      const propName = ctor._attributeToPropertyMap.get(name);

      if (propName !== undefined) {
        const options = ctor._classProperties.get(propName) || defaultPropertyDeclaration; // mark state reflecting

        this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
        this[propName] = // tslint:disable-next-line:no-any
        ctor._propertyValueFromAttribute(value, options); // mark state not reflecting

        this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
      }
    }
    /**
     * This private version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */


    _requestUpdate(name, oldValue) {
      let shouldRequestUpdate = true; // If we have a property key, perform property update steps.

      if (name !== undefined) {
        const ctor = this.constructor;
        const options = ctor._classProperties.get(name) || defaultPropertyDeclaration;

        if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
          if (!this._changedProperties.has(name)) {
            this._changedProperties.set(name, oldValue);
          } // Add to reflecting properties set.
          // Note, it's important that every change has a chance to add the
          // property to `_reflectingProperties`. This ensures setting
          // attribute + property reflects correctly.


          if (options.reflect === true && !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
            if (this._reflectingProperties === undefined) {
              this._reflectingProperties = new Map();
            }

            this._reflectingProperties.set(name, options);
          }
        } else {
          // Abort the request if the property should not be considered changed.
          shouldRequestUpdate = false;
        }
      }

      if (!this._hasRequestedUpdate && shouldRequestUpdate) {
        this._enqueueUpdate();
      }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */


    requestUpdate(name, oldValue) {
      this._requestUpdate(name, oldValue);

      return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */


    async _enqueueUpdate() {
      // Mark state updating...
      this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
      let resolve;
      let reject;
      const previousUpdatePromise = this._updatePromise;
      this._updatePromise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });

      try {
        // Ensure any previous update has resolved before updating.
        // This `await` also ensures that property changes are batched.
        await previousUpdatePromise;
      } catch (e) {} // Ignore any previous errors. We only care that the previous cycle is
      // done. Any error should have been handled in the previous update.
      // Make sure the element has connected before updating.


      if (!this._hasConnected) {
        await new Promise(res => this._hasConnectedResolver = res);
      }

      try {
        const result = this.performUpdate(); // If `performUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.

        if (result != null) {
          await result;
        }
      } catch (e) {
        reject(e);
      }

      resolve(!this._hasRequestedUpdate);
    }

    get _hasConnected() {
      return this._updateState & STATE_HAS_CONNECTED;
    }

    get _hasRequestedUpdate() {
      return this._updateState & STATE_UPDATE_REQUESTED;
    }

    get hasUpdated() {
      return this._updateState & STATE_HAS_UPDATED;
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */


    performUpdate() {
      // Mixin instance properties once, if they exist.
      if (this._instanceProperties) {
        this._applyInstanceProperties();
      }

      let shouldUpdate = false;
      const changedProperties = this._changedProperties;

      try {
        shouldUpdate = this.shouldUpdate(changedProperties);

        if (shouldUpdate) {
          this.update(changedProperties);
        }
      } catch (e) {
        // Prevent `firstUpdated` and `updated` from running when there's an
        // update exception.
        shouldUpdate = false;
        throw e;
      } finally {
        // Ensure element can accept additional updates after an exception.
        this._markUpdated();
      }

      if (shouldUpdate) {
        if (!(this._updateState & STATE_HAS_UPDATED)) {
          this._updateState = this._updateState | STATE_HAS_UPDATED;
          this.firstUpdated(changedProperties);
        }

        this.updated(changedProperties);
      }
    }

    _markUpdated() {
      this._changedProperties = new Map();
      this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `_getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super._getUpdateComplete()`, then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */


    get updateComplete() {
      return this._getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async _getUpdateComplete() {
     *       await super._getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     */


    _getUpdateComplete() {
      return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * * @param _changedProperties Map of changed properties with old values
     */


    shouldUpdate(_changedProperties) {
      return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * * @param _changedProperties Map of changed properties with old values
     */


    update(_changedProperties) {
      if (this._reflectingProperties !== undefined && this._reflectingProperties.size > 0) {
        // Use forEach so this works even if for/of loops are compiled to for
        // loops expecting arrays
        this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));

        this._reflectingProperties = undefined;
      }
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * * @param _changedProperties Map of changed properties with old values
     */


    updated(_changedProperties) {}
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * * @param _changedProperties Map of changed properties with old values
     */


    firstUpdated(_changedProperties) {}

  }
  _a = finalized;
  /**
   * Marks class as having finished creating properties.
   */

  UpdatingElement[_a] = true;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const legacyCustomElement = (tagName, clazz) => {
    window.customElements.define(tagName, clazz); // Cast as any because TS doesn't recognize the return type as being a
    // subtype of the decorated class when clazz is typed as
    // `Constructor<HTMLElement>` for some reason.
    // `Constructor<HTMLElement>` is helpful to make sure the decorator is
    // applied to elements however.
    // tslint:disable-next-line:no-any

    return clazz;
  };

  const standardCustomElement = (tagName, descriptor) => {
    const {
      kind,
      elements
    } = descriptor;
    return {
      kind,
      elements,

      // This callback is called once the class is otherwise fully defined
      finisher(clazz) {
        window.customElements.define(tagName, clazz);
      }

    };
  };
  /**
   * Class decorator factory that defines the decorated class as a custom element.
   *
   * @param tagName the name of the custom element to define
   */


  const customElement = tagName => classOrDescriptor => typeof classOrDescriptor === 'function' ? legacyCustomElement(tagName, classOrDescriptor) : standardCustomElement(tagName, classOrDescriptor);

  const standardProperty = (options, element) => {
    // When decorating an accessor, pass it through and add property metadata.
    // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
    // stomp over the user's accessor.
    if (element.kind === 'method' && element.descriptor && !('value' in element.descriptor)) {
      return Object.assign({}, element, {
        finisher(clazz) {
          clazz.createProperty(element.key, options);
        }

      });
    } else {
      // createProperty() takes care of defining the property, but we still
      // must return some kind of descriptor, so return a descriptor for an
      // unused prototype field. The finisher calls createProperty().
      return {
        kind: 'field',
        key: Symbol(),
        placement: 'own',
        descriptor: {},

        // When @babel/plugin-proposal-decorators implements initializers,
        // do this instead of the initializer below. See:
        // https://github.com/babel/babel/issues/9260 extras: [
        //   {
        //     kind: 'initializer',
        //     placement: 'own',
        //     initializer: descriptor.initializer,
        //   }
        // ],
        initializer() {
          if (typeof element.initializer === 'function') {
            this[element.key] = element.initializer.call(this);
          }
        },

        finisher(clazz) {
          clazz.createProperty(element.key, options);
        }

      };
    }
  };

  const legacyProperty = (options, proto, name) => {
    proto.constructor.createProperty(name, options);
  };
  /**
   * A property decorator which creates a LitElement property which reflects a
   * corresponding attribute value. A `PropertyDeclaration` may optionally be
   * supplied to configure property features.
   *
   * @ExportDecoratedItems
   */


  function property(options) {
    // tslint:disable-next-line:no-any decorator
    return (protoOrDescriptor, name) => name !== undefined ? legacyProperty(options, protoOrDescriptor, name) : standardProperty(options, protoOrDescriptor);
  }

  /**
  @license
  Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at
  http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
  http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
  found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
  part of the polymer project is also subject to an additional IP rights grant
  found at http://polymer.github.io/PATENTS.txt
  */
  const supportsAdoptingStyleSheets = 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype;
  const constructionToken = Symbol();
  class CSSResult {
    constructor(cssText, safeToken) {
      if (safeToken !== constructionToken) {
        throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
      }

      this.cssText = cssText;
    } // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.


    get styleSheet() {
      if (this._styleSheet === undefined) {
        // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
        // is constructable.
        if (supportsAdoptingStyleSheets) {
          this._styleSheet = new CSSStyleSheet();

          this._styleSheet.replaceSync(this.cssText);
        } else {
          this._styleSheet = null;
        }
      }

      return this._styleSheet;
    }

    toString() {
      return this.cssText;
    }

  }

  const textFromCSSResult = value => {
    if (value instanceof CSSResult) {
      return value.cssText;
    } else if (typeof value === 'number') {
      return value;
    } else {
      throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    }
  };
  /**
   * Template tag which which can be used with LitElement's `style` property to
   * set element styles. For security reasons, only literal string values may be
   * used. To incorporate non-literal values `unsafeCSS` may be used inside a
   * template string part.
   */


  const css = (strings, ...values) => {
    const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // This line will be used in regexes to search for LitElement usage.
  // TODO(justinfagnani): inject version number at build time

  (window['litElementVersions'] || (window['litElementVersions'] = [])).push('2.2.1');
  /**
   * Minimal implementation of Array.prototype.flat
   * @param arr the array to flatten
   * @param result the accumlated result
   */

  function arrayFlat(styles, result = []) {
    for (let i = 0, length = styles.length; i < length; i++) {
      const value = styles[i];

      if (Array.isArray(value)) {
        arrayFlat(value, result);
      } else {
        result.push(value);
      }
    }

    return result;
  }
  /** Deeply flattens styles array. Uses native flat if available. */


  const flattenStyles = styles => styles.flat ? styles.flat(Infinity) : arrayFlat(styles);

  class LitElement extends UpdatingElement {
    /** @nocollapse */
    static finalize() {
      // The Closure JS Compiler does not always preserve the correct "this"
      // when calling static super methods (b/137460243), so explicitly bind.
      super.finalize.call(this); // Prepare styling that is stamped at first render time. Styling
      // is built from user provided `styles` or is inherited from the superclass.

      this._styles = this.hasOwnProperty(JSCompiler_renameProperty('styles', this)) ? this._getUniqueStyles() : this._styles || [];
    }
    /** @nocollapse */


    static _getUniqueStyles() {
      // Take care not to call `this.styles` multiple times since this generates
      // new CSSResults each time.
      // TODO(sorvell): Since we do not cache CSSResults by input, any
      // shared styles will generate new stylesheet objects, which is wasteful.
      // This should be addressed when a browser ships constructable
      // stylesheets.
      const userStyles = this.styles;
      const styles = [];

      if (Array.isArray(userStyles)) {
        const flatStyles = flattenStyles(userStyles); // As a performance optimization to avoid duplicated styling that can
        // occur especially when composing via subclassing, de-duplicate styles
        // preserving the last item in the list. The last item is kept to
        // try to preserve cascade order with the assumption that it's most
        // important that last added styles override previous styles.

        const styleSet = flatStyles.reduceRight((set, s) => {
          set.add(s); // on IE set.add does not return the set.

          return set;
        }, new Set()); // Array.from does not work on Set in IE

        styleSet.forEach(v => styles.unshift(v));
      } else if (userStyles) {
        styles.push(userStyles);
      }

      return styles;
    }
    /**
     * Performs element initialization. By default this calls `createRenderRoot`
     * to create the element `renderRoot` node and captures any pre-set values for
     * registered properties.
     */


    initialize() {
      super.initialize();
      this.renderRoot = this.createRenderRoot(); // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
      // element's getRootNode(). While this could be done, we're choosing not to
      // support this now since it would require different logic around de-duping.

      if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
        this.adoptStyles();
      }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */


    createRenderRoot() {
      return this.attachShadow({
        mode: 'open'
      });
    }
    /**
     * Applies styling to the element shadowRoot using the `static get styles`
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */


    adoptStyles() {
      const styles = this.constructor._styles;

      if (styles.length === 0) {
        return;
      } // There are three separate cases here based on Shadow DOM support.
      // (1) shadowRoot polyfilled: use ShadyCSS
      // (2) shadowRoot.adoptedStyleSheets available: use it.
      // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
      // rendering


      if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
        window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map(s => s.cssText), this.localName);
      } else if (supportsAdoptingStyleSheets) {
        this.renderRoot.adoptedStyleSheets = styles.map(s => s.styleSheet);
      } else {
        // This must be done after rendering so the actual style insertion is done
        // in `update`.
        this._needsShimAdoptedStyleSheets = true;
      }
    }

    connectedCallback() {
      super.connectedCallback(); // Note, first update/render handles styleElement so we only call this if
      // connected after first update.

      if (this.hasUpdated && window.ShadyCSS !== undefined) {
        window.ShadyCSS.styleElement(this);
      }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * * @param _changedProperties Map of changed properties with old values
     */


    update(changedProperties) {
      super.update(changedProperties);
      const templateResult = this.render();

      if (templateResult instanceof TemplateResult) {
        this.constructor.render(templateResult, this.renderRoot, {
          scopeName: this.localName,
          eventContext: this
        });
      } // When native Shadow DOM is used but adoptedStyles are not supported,
      // insert styling after rendering to ensure adoptedStyles have highest
      // priority.


      if (this._needsShimAdoptedStyleSheets) {
        this._needsShimAdoptedStyleSheets = false;

        this.constructor._styles.forEach(s => {
          const style = document.createElement('style');
          style.textContent = s.cssText;
          this.renderRoot.appendChild(style);
        });
      }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method must return
     * a lit-html TemplateResult. Setting properties inside this method will *not*
     * trigger the element to update.
     */


    render() {}

  }
  /**
   * Ensure this class is marked as `finalized` as an optimization ensuring
   * it will not needlessly try to `finalize`.
   *
   * Note this property name is a string to prevent breaking Closure JS Compiler
   * optimizations. See updating-element.ts for more information.
   */

  LitElement['finalized'] = true;
  /**
   * Render method used to render the lit-html TemplateResult to the element's
   * DOM.
   * @param {TemplateResult} Template to render.
   * @param {Element|DocumentFragment} Node into which to render.
   * @param {String} Element name.
   * @nocollapse
   */

  LitElement.render = render$1;

  let pwbgeolocation = _decorate([customElement('pwb-geolocation')], function (_initialize, _LitElement) {
      class pwbgeolocation extends _LitElement {
          constructor(...args) {
              super(...args);
              _initialize(this);
          }
      }
      return {
          F: pwbgeolocation,
          d: [{
                  kind: "field",
                  decorators: [property()],
                  key: "currentPosition",
                  value: void 0
              }, {
                  kind: "field",
                  decorators: [property()],
                  key: "watchedPosition",
                  value: void 0
              }, {
                  kind: "method",
                  key: "getLocation",
                  value: function getLocation() {
                      if ("geolocation" in navigator) {
                          navigator.geolocation.getCurrentPosition(position => {
                              this.currentPosition = position.coords;
                              return position.coords;
                          });
                      }
                      else {
                          console.info("geolocation is not supported in this environment");
                          return null;
                      }
                  }
              }, {
                  kind: "method",
                  key: "watchLocation",
                  value: function watchLocation() {
                      if ("geolocation" in navigator) {
                          navigator.geolocation.watchPosition(position => {
                              this.watchedPosition = position.coords;
                              return position.coords;
                          });
                      }
                      else {
                          console.info("geolocation is not supported in this environment");
                          return null;
                      }
                  }
              }, {
                  kind: "method",
                  key: "render",
                  value: function render() {
                      return html ``;
                  }
              }]
      };
  }, LitElement);
  //# sourceMappingURL=pwb-geolocation.js.map

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  function __awaiter(thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  let pwbclipboard = _decorate([customElement('pwb-clipboard')], function (_initialize, _LitElement) {
      class pwbclipboard extends _LitElement {
          constructor(...args) {
              super(...args);
              _initialize(this);
          }
      }
      return {
          F: pwbclipboard,
          d: [{
                  kind: "field",
                  decorators: [property()],
                  key: "textToCopy",
                  value: void 0
              }, {
                  kind: "get",
                  static: true,
                  key: "styles",
                  value: function styles() {
                      return css `
      button {
        text-align: center;
        align-content: center;
        align-self: center;
        vertical-align: middle;
        justify-self: flex-end;
        max-width: 90px;
        min-width: 90px;
        line-height: 200%;
        flex: 0 0 auto;
        display: inline-block;
        background: #0078d4;
        color: #ffffff;
        cursor: pointer;
        border: solid 1px rgba(0, 0, 0, 0);
      }
    `;
                  }
              }, {
                  kind: "method",
                  key: "copyText",
                  value: function copyText() {
                      return __awaiter(this, void 0, void 0, function* () {
                          if (navigator.clipboard) {
                              try {
                                  if (this.textToCopy) {
                                      yield navigator.clipboard.writeText(this.textToCopy);
                                  }
                                  else {
                                      console.info("pwb-clipboard: You must pass the property textToCopy. Something like <pwb-clipboard texttocopy='hello world' />");
                                  }
                              }
                              catch (err) {
                                  console.error(err);
                              }
                          }
                      });
                  }
              }, {
                  kind: "method",
                  key: "readText",
                  value: function readText() {
                      return __awaiter(this, void 0, void 0, function* () {
                          if (navigator.clipboard) {
                              try {
                                  const clipboardText = yield navigator.clipboard.readText();
                                  if (clipboardText) {
                                      return clipboardText;
                                  }
                                  else {
                                      return null;
                                  }
                              }
                              catch (err) {
                                  console.error(err);
                              }
                          }
                      });
                  }
              }, {
                  kind: "method",
                  key: "render",
                  value: function render() {
                      /**
                       * Use JavaScript expressions to include property values in
                       * the element template.
                       */
                      return html `
      <button @click="${() => this.copyText()}">
        <slot>
          Copy
        </slot>
      </button>
    `;
                  }
              }]
      };
  }, LitElement);
  //# sourceMappingURL=pwb-clipboard.js.map

  let pwbshare = _decorate([customElement('pwb-share')], function (_initialize, _LitElement) {
      class pwbshare extends _LitElement {
          constructor(...args) {
              super(...args);
              _initialize(this);
          }
      }
      return {
          F: pwbshare,
          d: [{
                  kind: "field",
                  decorators: [property()],
                  key: "title",
                  value: void 0
              }, {
                  kind: "field",
                  decorators: [property()],
                  key: "text",
                  value: void 0
              }, {
                  kind: "field",
                  decorators: [property()],
                  key: "url",
                  value: void 0
              }, {
                  kind: "method",
                  key: "share",
                  value: function share() {
                      return __awaiter(this, void 0, void 0, function* () {
                          // have to cast to any here
                          // because typescript lacks
                          // types for the web share api
                          if (navigator.share) {
                              try {
                                  yield navigator.share({
                                      title: this.title,
                                      text: this.text,
                                      url: this.url
                                  });
                              }
                              catch (err) {
                                  console.error('pwb-share: There was an error trying to share this content, make sure you pass a title, text and url');
                              }
                          }
                      });
                  }
              }, {
                  kind: "method",
                  key: "render",
                  value: function render() {
                      return html `<button @click="${() => this.share()}">Share</button>`;
                  }
              }]
      };
  }, LitElement);
  //# sourceMappingURL=pwb-share.js.map

  let pwbinstall = _decorate([customElement('pwb-install')], function (_initialize, _LitElement) {
      class pwbinstall extends _LitElement {
          constructor(...args) {
              super(...args);
              _initialize(this);
          }
      }
      return {
          F: pwbinstall,
          d: [{
                  kind: "field",
                  decorators: [property()],
                  key: "deferredPrompt",
                  value: void 0
              }, {
                  kind: "field",
                  decorators: [property()],
                  key: "manifestPath",
                  value: void 0
              }, {
                  kind: "field",
                  decorators: [property()],
                  key: "iconPath",
                  value: void 0
              }, {
                  kind: "field",
                  decorators: [property()],
                  key: "manifestData",
                  value: void 0
              }, {
                  kind: "field",
                  decorators: [property()],
                  key: "openModal",
                  value() {
                      return false;
                  }
              }, {
                  kind: "get",
                  static: true,
                  key: "styles",
                  value: function styles() {
                      return css `
     #installModal {
      background: white;
      position: fixed;
      top: 6em;
      bottom: 12em;
      left: 16em;
      right: 16em;
      padding: 2em;
      padding-top: 1em;
      font-family: sans-serif;
      box-shadow: 0 28px 48px rgba(0, 0, 0, .4);

      animation-name: opened;
      animation-duration: 250ms;
     }

     @keyframes opened {
      from {
        transform: scale(0.4, 0.4);
        opacity: 0.4;
      }
      to {
        transform: scale(1, 1);
        opacity: 1;
      }
    }

    @keyframes fadein {
      from {
        opacity: 0.2;
      }
      to {
        opacity: 1;
      }
    }

     #background {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #7b7b7ba6;

      animation-name: fadein;
      animation-duration: 250ms;
     }

     #headerContainer {
      display: flex;
      align-items: center;
     }

     #headerContainer img {
      height: 6em;
      margin-right: 1em;
      background: lightgrey;
      border-radius: 10px;
      padding: 12px;
     }

     #buttonsContainer {
      display: flex;
      justify-content: flex-end;
      position: relative;
      bottom: -4em;
      right: -1em;
     }

     #openButton, #installButton {
      text-align: center;
      align-content: center;
      align-self: center;
      vertical-align: middle;
      justify-self: flex-end;
      max-width: 90px;
      min-width: 90px;
      line-height: 200%;
      flex: 0 0 auto;
      display: inline-block;
      background: #0078d4;
      color: #ffffff;
      cursor: pointer;
      border: solid 1px rgba(0, 0, 0, 0);
     }

     #cancelButton {
      background: #ee1111;
      color: white;
      max-width: 90px;
      min-width: 90px;
      line-height: 200%;
      margin-right: 10px;
      outline: none;
      border: solid 1px rgba(0, 0, 0, 0);
      cursor: pointer;
      margin-left: 10px;
     }

     #screenshots img {
      height: 12em;
      margin-right: 12px;
     }

     #tagsDiv {
      margin-top: 1em;
      margin-bottom: 1em;
     }

     #desc {
      width: 34em;
     }

      #tagsDiv span {
        background: grey;
        color: white;
        padding-left: 12px;
        padding-right: 12px;
        padding-bottom: 4px;
        font-weight: bold;
        border-radius: 24px;
        margin-right: 12px;
        padding-top: 1px;
      }
    `;
                  }
              }, {
                  kind: "method",
                  key: "firstUpdated",
                  value: function firstUpdated() {
                      return __awaiter(this, void 0, void 0, function* () {
                          if (this.manifestPath) {
                              yield this.getManifestData();
                          }
                          window.addEventListener('beforeinstallprompt', e => {
                              console.log('e', e); // Prevent Chrome 67 and earlier from automatically showing the prompt
                              e.preventDefault(); // Stash the event so it can be triggered later.
                              this.deferredPrompt = e;
                          });
                      });
                  }
              }, {
                  kind: "method",
                  key: "getManifestData",
                  value: function getManifestData() {
                      return __awaiter(this, void 0, void 0, function* () {
                          const response = yield fetch(this.manifestPath);
                          const data = yield response.json();
                          console.log(data);
                          this.manifestData = data;
                      });
                  }
              }, {
                  kind: "method",
                  key: "openPrompt",
                  value: function openPrompt() {
                      this.openModal = true;
                  }
              }, {
                  kind: "method",
                  key: "install",
                  value: function install() {
                      return __awaiter(this, void 0, void 0, function* () {
                          if (this.deferredPrompt) {
                              this.deferredPrompt.prompt();
                              const choiceResult = yield this.deferredPrompt.userChoice;
                              if (choiceResult.outcome === 'accepted') {
                                  console.log('Your PWA has been installed');
                                  return true;
                              }
                              else {
                                  console.log('User chose to not install your PWA');
                                  return false;
                              }
                          }
                      });
                  }
              }, {
                  kind: "method",
                  key: "cancel",
                  value: function cancel() {
                      this.openModal = false;
                  }
              }, {
                  kind: "method",
                  key: "render",
                  value: function render() {
                      return html `
      <button id="openButton" @click="${() => this.openPrompt()}">
        <slot>
          Install
        </slot>
      </button>

      ${this.openModal ? html `<div id="background" @click="${() => this.cancel()}"></div>` : null}

      ${this.openModal ? html `
          <div id="installModal">
          <div id="headerContainer">
          <img src="${this.iconPath}"></img>

          <div>
            <h1>${this.manifestData.name}</h1>

            ${this.manifestData.categories ? html `<div id="tagsDiv">
              ${this.manifestData.categories.map(tag => {
                        return html `
                  <span>${tag}</span>
                `;
                    })}
            </div>` : null}

            <p id="desc">
              ${this.manifestData.description}
            </p>
          </div>
        </div>

        <div id="contentContainer">
          ${this.manifestData.screenshots ? html `
            <div>
              <h3>Screenshots</h3>
              <div id="screenshots">
                ${this.manifestData.screenshots.map(screen => {
                        return html `
                        <img src="${screen.src}">
                      `;
                    })}
              </div>
            </div>
            ` : null}
        </div>

        <div id="buttonsContainer">
          <button id="installButton" @click="${() => this.install()}">Install</button>
          <button id="cancelButton"  @click="${() => this.cancel()}">Cancel</button>
        </div>
          </div>
        ` : null}
    `;
                  }
              }]
      };
  }, LitElement);
  //# sourceMappingURL=pwb-install.js.map

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var enums = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  // Copyright (c) Microsoft Corporation. All rights reserved.
  // Licensed under the MIT License.
  var ActionStyle = /** @class */ (function () {
      function ActionStyle() {
      }
      ActionStyle.Default = "default";
      ActionStyle.Positive = "positive";
      ActionStyle.Destructive = "destructive";
      return ActionStyle;
  }());
  exports.ActionStyle = ActionStyle;
  var Size;
  (function (Size) {
      Size[Size["Auto"] = 0] = "Auto";
      Size[Size["Stretch"] = 1] = "Stretch";
      Size[Size["Small"] = 2] = "Small";
      Size[Size["Medium"] = 3] = "Medium";
      Size[Size["Large"] = 4] = "Large";
  })(Size = exports.Size || (exports.Size = {}));
  var SizeUnit;
  (function (SizeUnit) {
      SizeUnit[SizeUnit["Weight"] = 0] = "Weight";
      SizeUnit[SizeUnit["Pixel"] = 1] = "Pixel";
  })(SizeUnit = exports.SizeUnit || (exports.SizeUnit = {}));
  var TextSize;
  (function (TextSize) {
      TextSize[TextSize["Small"] = 0] = "Small";
      TextSize[TextSize["Default"] = 1] = "Default";
      TextSize[TextSize["Medium"] = 2] = "Medium";
      TextSize[TextSize["Large"] = 3] = "Large";
      TextSize[TextSize["ExtraLarge"] = 4] = "ExtraLarge";
  })(TextSize = exports.TextSize || (exports.TextSize = {}));
  var TextWeight;
  (function (TextWeight) {
      TextWeight[TextWeight["Lighter"] = 0] = "Lighter";
      TextWeight[TextWeight["Default"] = 1] = "Default";
      TextWeight[TextWeight["Bolder"] = 2] = "Bolder";
  })(TextWeight = exports.TextWeight || (exports.TextWeight = {}));
  var FontType;
  (function (FontType) {
      FontType[FontType["Default"] = 0] = "Default";
      FontType[FontType["Monospace"] = 1] = "Monospace";
  })(FontType = exports.FontType || (exports.FontType = {}));
  var Spacing;
  (function (Spacing) {
      Spacing[Spacing["None"] = 0] = "None";
      Spacing[Spacing["Small"] = 1] = "Small";
      Spacing[Spacing["Default"] = 2] = "Default";
      Spacing[Spacing["Medium"] = 3] = "Medium";
      Spacing[Spacing["Large"] = 4] = "Large";
      Spacing[Spacing["ExtraLarge"] = 5] = "ExtraLarge";
      Spacing[Spacing["Padding"] = 6] = "Padding";
  })(Spacing = exports.Spacing || (exports.Spacing = {}));
  var TextColor;
  (function (TextColor) {
      TextColor[TextColor["Default"] = 0] = "Default";
      TextColor[TextColor["Dark"] = 1] = "Dark";
      TextColor[TextColor["Light"] = 2] = "Light";
      TextColor[TextColor["Accent"] = 3] = "Accent";
      TextColor[TextColor["Good"] = 4] = "Good";
      TextColor[TextColor["Warning"] = 5] = "Warning";
      TextColor[TextColor["Attention"] = 6] = "Attention";
  })(TextColor = exports.TextColor || (exports.TextColor = {}));
  var HorizontalAlignment;
  (function (HorizontalAlignment) {
      HorizontalAlignment[HorizontalAlignment["Left"] = 0] = "Left";
      HorizontalAlignment[HorizontalAlignment["Center"] = 1] = "Center";
      HorizontalAlignment[HorizontalAlignment["Right"] = 2] = "Right";
  })(HorizontalAlignment = exports.HorizontalAlignment || (exports.HorizontalAlignment = {}));
  var VerticalAlignment;
  (function (VerticalAlignment) {
      VerticalAlignment[VerticalAlignment["Top"] = 0] = "Top";
      VerticalAlignment[VerticalAlignment["Center"] = 1] = "Center";
      VerticalAlignment[VerticalAlignment["Bottom"] = 2] = "Bottom";
  })(VerticalAlignment = exports.VerticalAlignment || (exports.VerticalAlignment = {}));
  var ActionAlignment;
  (function (ActionAlignment) {
      ActionAlignment[ActionAlignment["Left"] = 0] = "Left";
      ActionAlignment[ActionAlignment["Center"] = 1] = "Center";
      ActionAlignment[ActionAlignment["Right"] = 2] = "Right";
      ActionAlignment[ActionAlignment["Stretch"] = 3] = "Stretch";
  })(ActionAlignment = exports.ActionAlignment || (exports.ActionAlignment = {}));
  var ImageStyle;
  (function (ImageStyle) {
      ImageStyle[ImageStyle["Default"] = 0] = "Default";
      ImageStyle[ImageStyle["Person"] = 1] = "Person";
  })(ImageStyle = exports.ImageStyle || (exports.ImageStyle = {}));
  var ShowCardActionMode;
  (function (ShowCardActionMode) {
      ShowCardActionMode[ShowCardActionMode["Inline"] = 0] = "Inline";
      ShowCardActionMode[ShowCardActionMode["Popup"] = 1] = "Popup";
  })(ShowCardActionMode = exports.ShowCardActionMode || (exports.ShowCardActionMode = {}));
  var Orientation;
  (function (Orientation) {
      Orientation[Orientation["Horizontal"] = 0] = "Horizontal";
      Orientation[Orientation["Vertical"] = 1] = "Vertical";
  })(Orientation = exports.Orientation || (exports.Orientation = {}));
  var FillMode;
  (function (FillMode) {
      FillMode[FillMode["Cover"] = 0] = "Cover";
      FillMode[FillMode["RepeatHorizontally"] = 1] = "RepeatHorizontally";
      FillMode[FillMode["RepeatVertically"] = 2] = "RepeatVertically";
      FillMode[FillMode["Repeat"] = 3] = "Repeat";
  })(FillMode = exports.FillMode || (exports.FillMode = {}));
  var ActionIconPlacement;
  (function (ActionIconPlacement) {
      ActionIconPlacement[ActionIconPlacement["LeftOfTitle"] = 0] = "LeftOfTitle";
      ActionIconPlacement[ActionIconPlacement["AboveTitle"] = 1] = "AboveTitle";
  })(ActionIconPlacement = exports.ActionIconPlacement || (exports.ActionIconPlacement = {}));
  var InputTextStyle;
  (function (InputTextStyle) {
      InputTextStyle[InputTextStyle["Text"] = 0] = "Text";
      InputTextStyle[InputTextStyle["Tel"] = 1] = "Tel";
      InputTextStyle[InputTextStyle["Url"] = 2] = "Url";
      InputTextStyle[InputTextStyle["Email"] = 3] = "Email";
  })(InputTextStyle = exports.InputTextStyle || (exports.InputTextStyle = {}));
  var InputValidationNecessity;
  (function (InputValidationNecessity) {
      InputValidationNecessity[InputValidationNecessity["Optional"] = 0] = "Optional";
      InputValidationNecessity[InputValidationNecessity["Required"] = 1] = "Required";
      InputValidationNecessity[InputValidationNecessity["RequiredWithVisualCue"] = 2] = "RequiredWithVisualCue";
  })(InputValidationNecessity = exports.InputValidationNecessity || (exports.InputValidationNecessity = {}));
  /*
      This should really be a string enum, e.g.

          export enum ContainerStyle {
              Default = "default",
              Emphasis = "emphasis"
          }

      However, some hosts do not use a version of TypeScript
      recent enough to understand string enums. This is
      a compatible construct that does not require using
      a more recent version of TypeScript.
  */
  var ContainerStyle = /** @class */ (function () {
      function ContainerStyle() {
      }
      ContainerStyle.Default = "default";
      ContainerStyle.Emphasis = "emphasis";
      ContainerStyle.Accent = "accent";
      ContainerStyle.Good = "good";
      ContainerStyle.Attention = "attention";
      ContainerStyle.Warning = "warning";
      return ContainerStyle;
  }());
  exports.ContainerStyle = ContainerStyle;
  var ValidationError;
  (function (ValidationError) {
      ValidationError[ValidationError["Hint"] = 0] = "Hint";
      ValidationError[ValidationError["ActionTypeNotAllowed"] = 1] = "ActionTypeNotAllowed";
      ValidationError[ValidationError["CollectionCantBeEmpty"] = 2] = "CollectionCantBeEmpty";
      ValidationError[ValidationError["Deprecated"] = 3] = "Deprecated";
      ValidationError[ValidationError["ElementTypeNotAllowed"] = 4] = "ElementTypeNotAllowed";
      ValidationError[ValidationError["InteractivityNotAllowed"] = 5] = "InteractivityNotAllowed";
      ValidationError[ValidationError["InvalidPropertyValue"] = 6] = "InvalidPropertyValue";
      ValidationError[ValidationError["MissingCardType"] = 7] = "MissingCardType";
      ValidationError[ValidationError["PropertyCantBeNull"] = 8] = "PropertyCantBeNull";
      ValidationError[ValidationError["TooManyActions"] = 9] = "TooManyActions";
      ValidationError[ValidationError["UnknownActionType"] = 10] = "UnknownActionType";
      ValidationError[ValidationError["UnknownElementType"] = 11] = "UnknownElementType";
      ValidationError[ValidationError["UnsupportedCardVersion"] = 12] = "UnsupportedCardVersion";
      ValidationError[ValidationError["DuplicateId"] = 13] = "DuplicateId";
  })(ValidationError = exports.ValidationError || (exports.ValidationError = {}));
  var ContainerFitStatus;
  (function (ContainerFitStatus) {
      ContainerFitStatus[ContainerFitStatus["FullyInContainer"] = 0] = "FullyInContainer";
      ContainerFitStatus[ContainerFitStatus["Overflowing"] = 1] = "Overflowing";
      ContainerFitStatus[ContainerFitStatus["FullyOutOfContainer"] = 2] = "FullyOutOfContainer";
  })(ContainerFitStatus = exports.ContainerFitStatus || (exports.ContainerFitStatus = {}));
  //# sourceMappingURL=enums.js.map
  });

  unwrapExports(enums);
  var enums_1 = enums.ActionStyle;
  var enums_2 = enums.Size;
  var enums_3 = enums.SizeUnit;
  var enums_4 = enums.TextSize;
  var enums_5 = enums.TextWeight;
  var enums_6 = enums.FontType;
  var enums_7 = enums.Spacing;
  var enums_8 = enums.TextColor;
  var enums_9 = enums.HorizontalAlignment;
  var enums_10 = enums.VerticalAlignment;
  var enums_11 = enums.ActionAlignment;
  var enums_12 = enums.ImageStyle;
  var enums_13 = enums.ShowCardActionMode;
  var enums_14 = enums.Orientation;
  var enums_15 = enums.FillMode;
  var enums_16 = enums.ActionIconPlacement;
  var enums_17 = enums.InputTextStyle;
  var enums_18 = enums.InputValidationNecessity;
  var enums_19 = enums.ContainerStyle;
  var enums_20 = enums.ValidationError;
  var enums_21 = enums.ContainerFitStatus;

  var shared = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  // Copyright (c) Microsoft Corporation. All rights reserved.
  // Licensed under the MIT License.

  exports.ContentTypes = {
      applicationJson: "application/json",
      applicationXWwwFormUrlencoded: "application/x-www-form-urlencoded"
  };
  var StringWithSubstitutions = /** @class */ (function () {
      function StringWithSubstitutions() {
          this._isProcessed = false;
          this._original = null;
          this._processed = null;
      }
      StringWithSubstitutions.prototype.getReferencedInputs = function (inputs, referencedInputs) {
          if (!referencedInputs) {
              throw new Error("The referencedInputs parameter cannot be null.");
          }
          for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
              var input = inputs_1[_i];
              var matches = new RegExp("\\{{2}(" + input.id + ").value\\}{2}", "gi").exec(this._original);
              if (matches != null) {
                  referencedInputs[input.id] = input;
              }
          }
      };
      StringWithSubstitutions.prototype.substituteInputValues = function (inputs, contentType) {
          this._processed = this._original;
          var regEx = /\{{2}([a-z0-9_$@]+).value\}{2}/gi;
          var matches;
          while ((matches = regEx.exec(this._original)) != null) {
              var matchedInput = null;
              for (var _i = 0, _a = Object.keys(inputs); _i < _a.length; _i++) {
                  var key = _a[_i];
                  if (key.toLowerCase() == matches[1].toLowerCase()) {
                      matchedInput = inputs[key];
                      break;
                  }
              }
              if (matchedInput) {
                  var valueForReplace = "";
                  if (matchedInput.value) {
                      valueForReplace = matchedInput.value;
                  }
                  if (contentType === exports.ContentTypes.applicationJson) {
                      valueForReplace = JSON.stringify(valueForReplace);
                      valueForReplace = valueForReplace.slice(1, -1);
                  }
                  else if (contentType === exports.ContentTypes.applicationXWwwFormUrlencoded) {
                      valueForReplace = encodeURIComponent(valueForReplace);
                  }
                  this._processed = this._processed.replace(matches[0], valueForReplace);
              }
          }
          this._isProcessed = true;
      };
      StringWithSubstitutions.prototype.getOriginal = function () {
          return this._original;
      };
      StringWithSubstitutions.prototype.get = function () {
          if (!this._isProcessed) {
              return this._original;
          }
          else {
              return this._processed;
          }
      };
      StringWithSubstitutions.prototype.set = function (value) {
          this._original = value;
          this._isProcessed = false;
      };
      return StringWithSubstitutions;
  }());
  exports.StringWithSubstitutions = StringWithSubstitutions;
  var SpacingDefinition = /** @class */ (function () {
      function SpacingDefinition(top, right, bottom, left) {
          if (top === void 0) { top = 0; }
          if (right === void 0) { right = 0; }
          if (bottom === void 0) { bottom = 0; }
          if (left === void 0) { left = 0; }
          this.left = 0;
          this.top = 0;
          this.right = 0;
          this.bottom = 0;
          this.top = top;
          this.right = right;
          this.bottom = bottom;
          this.left = left;
      }
      return SpacingDefinition;
  }());
  exports.SpacingDefinition = SpacingDefinition;
  var PaddingDefinition = /** @class */ (function () {
      function PaddingDefinition(top, right, bottom, left) {
          if (top === void 0) { top = enums.Spacing.None; }
          if (right === void 0) { right = enums.Spacing.None; }
          if (bottom === void 0) { bottom = enums.Spacing.None; }
          if (left === void 0) { left = enums.Spacing.None; }
          this.top = enums.Spacing.None;
          this.right = enums.Spacing.None;
          this.bottom = enums.Spacing.None;
          this.left = enums.Spacing.None;
          this.top = top;
          this.right = right;
          this.bottom = bottom;
          this.left = left;
      }
      return PaddingDefinition;
  }());
  exports.PaddingDefinition = PaddingDefinition;
  var SizeAndUnit = /** @class */ (function () {
      function SizeAndUnit(physicalSize, unit) {
          this.physicalSize = physicalSize;
          this.unit = unit;
      }
      SizeAndUnit.parse = function (input, requireUnitSpecifier) {
          if (requireUnitSpecifier === void 0) { requireUnitSpecifier = false; }
          var result = new SizeAndUnit(0, enums.SizeUnit.Weight);
          var regExp = /^([0-9]+)(px|\*)?$/g;
          var matches = regExp.exec(input);
          var expectedMatchCount = requireUnitSpecifier ? 3 : 2;
          if (matches && matches.length >= expectedMatchCount) {
              result.physicalSize = parseInt(matches[1]);
              if (matches.length == 3) {
                  if (matches[2] == "px") {
                      result.unit = enums.SizeUnit.Pixel;
                  }
              }
              return result;
          }
          throw new Error("Invalid size: " + input);
      };
      return SizeAndUnit;
  }());
  exports.SizeAndUnit = SizeAndUnit;
  /**
   * Fast UUID generator, RFC4122 version 4 compliant.
   * @author Jeff Ward (jcward.com).
   * @license MIT license
   * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
   **/
  var UUID = /** @class */ (function () {
      function UUID() {
      }
      UUID.generate = function () {
          var d0 = Math.random() * 0xffffffff | 0;
          var d1 = Math.random() * 0xffffffff | 0;
          var d2 = Math.random() * 0xffffffff | 0;
          var d3 = Math.random() * 0xffffffff | 0;
          return UUID.lut[d0 & 0xff] + UUID.lut[d0 >> 8 & 0xff] + UUID.lut[d0 >> 16 & 0xff] + UUID.lut[d0 >> 24 & 0xff] + '-' +
              UUID.lut[d1 & 0xff] + UUID.lut[d1 >> 8 & 0xff] + '-' + UUID.lut[d1 >> 16 & 0x0f | 0x40] + UUID.lut[d1 >> 24 & 0xff] + '-' +
              UUID.lut[d2 & 0x3f | 0x80] + UUID.lut[d2 >> 8 & 0xff] + '-' + UUID.lut[d2 >> 16 & 0xff] + UUID.lut[d2 >> 24 & 0xff] +
              UUID.lut[d3 & 0xff] + UUID.lut[d3 >> 8 & 0xff] + UUID.lut[d3 >> 16 & 0xff] + UUID.lut[d3 >> 24 & 0xff];
      };
      UUID.initialize = function () {
          for (var i = 0; i < 256; i++) {
              UUID.lut[i] = (i < 16 ? '0' : '') + i.toString(16);
          }
      };
      UUID.lut = [];
      return UUID;
  }());
  exports.UUID = UUID;
  UUID.initialize();
  //# sourceMappingURL=shared.js.map
  });

  unwrapExports(shared);
  var shared_1 = shared.ContentTypes;
  var shared_2 = shared.StringWithSubstitutions;
  var shared_3 = shared.SpacingDefinition;
  var shared_4 = shared.PaddingDefinition;
  var shared_5 = shared.SizeAndUnit;
  var shared_6 = shared.UUID;

  var utils = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  // Copyright (c) Microsoft Corporation. All rights reserved.
  // Licensed under the MIT License.


  function generateUniqueId() {
      return "__ac-" + shared.UUID.generate();
  }
  exports.generateUniqueId = generateUniqueId;
  function getStringValue(obj, defaultValue) {
      if (defaultValue === void 0) { defaultValue = undefined; }
      return obj ? obj.toString() : defaultValue;
  }
  exports.getStringValue = getStringValue;
  function getValueOrDefault(obj, defaultValue) {
      return obj ? obj : defaultValue;
  }
  exports.getValueOrDefault = getValueOrDefault;
  function isNullOrEmpty(value) {
      return value === undefined || value === null || value === "";
  }
  exports.isNullOrEmpty = isNullOrEmpty;
  function appendChild(node, child) {
      if (child != null && child != undefined) {
          node.appendChild(child);
      }
  }
  exports.appendChild = appendChild;
  function setProperty(target, propertyName, propertyValue, defaultValue) {
      if (defaultValue === void 0) { defaultValue = undefined; }
      if (propertyValue === null || propertyValue === undefined || propertyValue === defaultValue) {
          delete target[propertyName];
      }
      else {
          target[propertyName] = propertyValue;
      }
  }
  exports.setProperty = setProperty;
  function setEnumProperty(enumType, target, propertyName, propertyValue, defaultValue) {
      if (defaultValue === void 0) { defaultValue = undefined; }
      var targetValue = target[propertyName];
      var canDeleteTarget = targetValue == undefined ? true : enumType[targetValue] !== undefined;
      if (propertyValue == defaultValue) {
          if (canDeleteTarget) {
              delete target[propertyName];
          }
      }
      else {
          if (propertyValue == undefined) {
              if (canDeleteTarget) {
                  delete target[propertyName];
              }
          }
          else {
              target[propertyName] = enumType[propertyValue];
          }
      }
  }
  exports.setEnumProperty = setEnumProperty;
  function getBoolValue(value, defaultValue) {
      if (typeof value === "boolean") {
          return value;
      }
      else if (typeof value === "string") {
          switch (value.toLowerCase()) {
              case "true":
                  return true;
              case "false":
                  return false;
              default:
                  return defaultValue;
          }
      }
      return defaultValue;
  }
  exports.getBoolValue = getBoolValue;
  function getEnumValue(targetEnum, name, defaultValue) {
      if (isNullOrEmpty(name)) {
          return defaultValue;
      }
      for (var key in targetEnum) {
          var isValueProperty = parseInt(key, 10) >= 0;
          if (isValueProperty) {
              var value = targetEnum[key];
              if (value && typeof value === "string") {
                  if (value.toLowerCase() === name.toLowerCase()) {
                      return parseInt(key, 10);
                  }
              }
          }
      }
      return defaultValue;
  }
  exports.getEnumValue = getEnumValue;
  function parseHostConfigEnum(targetEnum, value, defaultValue) {
      if (typeof value === "string") {
          return getEnumValue(targetEnum, value, defaultValue);
      }
      else if (typeof value === "number") {
          return getValueOrDefault(value, defaultValue);
      }
      else {
          return defaultValue;
      }
  }
  exports.parseHostConfigEnum = parseHostConfigEnum;
  function renderSeparation(hostConfig, separationDefinition, orientation) {
      if (separationDefinition.spacing > 0 || separationDefinition.lineThickness > 0) {
          var separator = document.createElement("div");
          separator.className = hostConfig.makeCssClassName("ac-" + (orientation == enums.Orientation.Horizontal ? "horizontal" : "vertical") + "-separator");
          if (orientation == enums.Orientation.Horizontal) {
              if (separationDefinition.lineThickness) {
                  separator.style.paddingTop = (separationDefinition.spacing / 2) + "px";
                  separator.style.marginBottom = (separationDefinition.spacing / 2) + "px";
                  separator.style.borderBottom = separationDefinition.lineThickness + "px solid " + stringToCssColor(separationDefinition.lineColor);
              }
              else {
                  separator.style.height = separationDefinition.spacing + "px";
              }
          }
          else {
              if (separationDefinition.lineThickness) {
                  separator.style.paddingLeft = (separationDefinition.spacing / 2) + "px";
                  separator.style.marginRight = (separationDefinition.spacing / 2) + "px";
                  separator.style.borderRight = separationDefinition.lineThickness + "px solid " + stringToCssColor(separationDefinition.lineColor);
              }
              else {
                  separator.style.width = separationDefinition.spacing + "px";
              }
          }
          separator.style.overflow = "hidden";
          return separator;
      }
      else {
          return null;
      }
  }
  exports.renderSeparation = renderSeparation;
  function stringToCssColor(color) {
      var regEx = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})?/gi;
      var matches = regEx.exec(color);
      if (matches && matches[4]) {
          var a = parseInt(matches[1], 16) / 255;
          var r = parseInt(matches[2], 16);
          var g = parseInt(matches[3], 16);
          var b = parseInt(matches[4], 16);
          return "rgba(" + r + "," + g + "," + b + "," + a + ")";
      }
      else {
          return color;
      }
  }
  exports.stringToCssColor = stringToCssColor;
  function truncate(element, maxHeight, lineHeight) {
      var fits = function () {
          // Allow a one pixel overflow to account for rounding differences
          // between browsers
          return maxHeight - element.scrollHeight >= -1.0;
      };
      if (fits())
          return;
      var fullText = element.innerHTML;
      var truncateAt = function (idx) {
          element.innerHTML = fullText.substring(0, idx) + '...';
      };
      var breakableIndices = findBreakableIndices(fullText);
      var lo = 0;
      var hi = breakableIndices.length;
      var bestBreakIdx = 0;
      // Do a binary search for the longest string that fits
      while (lo < hi) {
          var mid = Math.floor((lo + hi) / 2);
          truncateAt(breakableIndices[mid]);
          if (fits()) {
              bestBreakIdx = breakableIndices[mid];
              lo = mid + 1;
          }
          else {
              hi = mid;
          }
      }
      truncateAt(bestBreakIdx);
      // If we have extra room, try to expand the string letter by letter
      // (covers the case where we have to break in the middle of a long word)
      if (lineHeight && maxHeight - element.scrollHeight >= lineHeight - 1.0) {
          var idx = findNextCharacter(fullText, bestBreakIdx);
          while (idx < fullText.length) {
              truncateAt(idx);
              if (fits()) {
                  bestBreakIdx = idx;
                  idx = findNextCharacter(fullText, idx);
              }
              else {
                  break;
              }
          }
          truncateAt(bestBreakIdx);
      }
  }
  exports.truncate = truncate;
  function findBreakableIndices(html) {
      var results = [];
      var idx = findNextCharacter(html, -1);
      while (idx < html.length) {
          if (html[idx] == ' ') {
              results.push(idx);
          }
          idx = findNextCharacter(html, idx);
      }
      return results;
  }
  function findNextCharacter(html, currIdx) {
      currIdx += 1;
      // If we found the start of an HTML tag, keep advancing until we get
      // past it, so we don't end up truncating in the middle of the tag
      while (currIdx < html.length && html[currIdx] == '<') {
          while (currIdx < html.length && html[currIdx++] != '>')
              ;
      }
      return currIdx;
  }
  function getFitStatus(element, containerEnd) {
      var start = element.offsetTop;
      var end = start + element.clientHeight;
      if (end <= containerEnd) {
          return enums.ContainerFitStatus.FullyInContainer;
      }
      else if (start < containerEnd) {
          return enums.ContainerFitStatus.Overflowing;
      }
      else {
          return enums.ContainerFitStatus.FullyOutOfContainer;
      }
  }
  exports.getFitStatus = getFitStatus;
  //# sourceMappingURL=utils.js.map
  });

  unwrapExports(utils);
  var utils_1 = utils.generateUniqueId;
  var utils_2 = utils.getStringValue;
  var utils_3 = utils.getValueOrDefault;
  var utils_4 = utils.isNullOrEmpty;
  var utils_5 = utils.appendChild;
  var utils_6 = utils.setProperty;
  var utils_7 = utils.setEnumProperty;
  var utils_8 = utils.getBoolValue;
  var utils_9 = utils.getEnumValue;
  var utils_10 = utils.parseHostConfigEnum;
  var utils_11 = utils.renderSeparation;
  var utils_12 = utils.stringToCssColor;
  var utils_13 = utils.truncate;
  var utils_14 = utils.getFitStatus;

  var hostConfig = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });
  // Copyright (c) Microsoft Corporation. All rights reserved.
  // Licensed under the MIT License.



  var ColorDefinition = /** @class */ (function () {
      function ColorDefinition(defaultColor, subtleColor) {
          this.default = "#000000";
          this.subtle = "#666666";
          if (defaultColor) {
              this.default = defaultColor;
          }
          if (subtleColor) {
              this.subtle = subtleColor;
          }
      }
      ColorDefinition.prototype.parse = function (obj) {
          if (obj) {
              this.default = obj["default"] || this.default;
              this.subtle = obj["subtle"] || this.subtle;
          }
      };
      return ColorDefinition;
  }());
  exports.ColorDefinition = ColorDefinition;
  var TextColorDefinition = /** @class */ (function (_super) {
      __extends(TextColorDefinition, _super);
      function TextColorDefinition() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.highlightColors = new ColorDefinition("#22000000", "#11000000");
          return _this;
      }
      TextColorDefinition.prototype.parse = function (obj) {
          _super.prototype.parse.call(this, obj);
          if (obj) {
              this.highlightColors.parse(obj["highlightColors"]);
          }
      };
      return TextColorDefinition;
  }(ColorDefinition));
  exports.TextColorDefinition = TextColorDefinition;
  var AdaptiveCardConfig = /** @class */ (function () {
      function AdaptiveCardConfig(obj) {
          this.allowCustomStyle = false;
          if (obj) {
              this.allowCustomStyle = obj["allowCustomStyle"] || this.allowCustomStyle;
          }
      }
      return AdaptiveCardConfig;
  }());
  exports.AdaptiveCardConfig = AdaptiveCardConfig;
  var ImageSetConfig = /** @class */ (function () {
      function ImageSetConfig(obj) {
          this.imageSize = enums.Size.Medium;
          this.maxImageHeight = 100;
          if (obj) {
              this.imageSize = obj["imageSize"] != null ? obj["imageSize"] : this.imageSize;
              this.maxImageHeight = utils.getValueOrDefault(obj["maxImageHeight"], 100);
          }
      }
      ImageSetConfig.prototype.toJSON = function () {
          return {
              imageSize: enums.Size[this.imageSize],
              maxImageHeight: this.maxImageHeight
          };
      };
      return ImageSetConfig;
  }());
  exports.ImageSetConfig = ImageSetConfig;
  var MediaConfig = /** @class */ (function () {
      function MediaConfig(obj) {
          this.allowInlinePlayback = true;
          if (obj) {
              this.defaultPoster = obj["defaultPoster"];
              this.allowInlinePlayback = obj["allowInlinePlayback"] || this.allowInlinePlayback;
          }
      }
      MediaConfig.prototype.toJSON = function () {
          return {
              defaultPoster: this.defaultPoster,
              allowInlinePlayback: this.allowInlinePlayback
          };
      };
      return MediaConfig;
  }());
  exports.MediaConfig = MediaConfig;
  var FactTextDefinition = /** @class */ (function () {
      function FactTextDefinition(obj) {
          this.size = enums.TextSize.Default;
          this.color = enums.TextColor.Default;
          this.isSubtle = false;
          this.weight = enums.TextWeight.Default;
          this.wrap = true;
          if (obj) {
              this.size = utils.parseHostConfigEnum(enums.TextSize, obj["size"], enums.TextSize.Default);
              this.color = utils.parseHostConfigEnum(enums.TextColor, obj["color"], enums.TextColor.Default);
              this.isSubtle = obj["isSubtle"] || this.isSubtle;
              this.weight = utils.parseHostConfigEnum(enums.TextWeight, obj["weight"], this.getDefaultWeight());
              this.wrap = obj["wrap"] != null ? obj["wrap"] : this.wrap;
          }
      }
      FactTextDefinition.prototype.getDefaultWeight = function () {
          return enums.TextWeight.Default;
      };
      FactTextDefinition.prototype.toJSON = function () {
          return {
              size: enums.TextSize[this.size],
              color: enums.TextColor[this.color],
              isSubtle: this.isSubtle,
              weight: enums.TextWeight[this.weight],
              wrap: this.wrap
          };
      };
      return FactTextDefinition;
  }());
  exports.FactTextDefinition = FactTextDefinition;
  var FactTitleDefinition = /** @class */ (function (_super) {
      __extends(FactTitleDefinition, _super);
      function FactTitleDefinition(obj) {
          var _this = _super.call(this, obj) || this;
          _this.maxWidth = 150;
          _this.weight = enums.TextWeight.Bolder;
          if (obj) {
              _this.maxWidth = obj["maxWidth"] != null ? obj["maxWidth"] : _this.maxWidth;
              _this.weight = utils.parseHostConfigEnum(enums.TextWeight, obj["weight"], enums.TextWeight.Bolder);
          }
          return _this;
      }
      FactTitleDefinition.prototype.getDefaultWeight = function () {
          return enums.TextWeight.Bolder;
      };
      return FactTitleDefinition;
  }(FactTextDefinition));
  exports.FactTitleDefinition = FactTitleDefinition;
  var FactSetConfig = /** @class */ (function () {
      function FactSetConfig(obj) {
          this.title = new FactTitleDefinition();
          this.value = new FactTextDefinition();
          this.spacing = 10;
          if (obj) {
              this.title = new FactTitleDefinition(obj["title"]);
              this.value = new FactTextDefinition(obj["value"]);
              this.spacing = obj.spacing && obj.spacing != null ? obj.spacing && obj.spacing : this.spacing;
          }
      }
      return FactSetConfig;
  }());
  exports.FactSetConfig = FactSetConfig;
  var ShowCardActionConfig = /** @class */ (function () {
      function ShowCardActionConfig(obj) {
          this.actionMode = enums.ShowCardActionMode.Inline;
          this.inlineTopMargin = 16;
          this.style = enums.ContainerStyle.Emphasis;
          if (obj) {
              this.actionMode = utils.parseHostConfigEnum(enums.ShowCardActionMode, obj["actionMode"], enums.ShowCardActionMode.Inline);
              this.inlineTopMargin = obj["inlineTopMargin"] != null ? obj["inlineTopMargin"] : this.inlineTopMargin;
              this.style = obj["style"] && typeof obj["style"] === "string" ? obj["style"] : enums.ContainerStyle.Emphasis;
          }
      }
      ShowCardActionConfig.prototype.toJSON = function () {
          return {
              actionMode: enums.ShowCardActionMode[this.actionMode],
              inlineTopMargin: this.inlineTopMargin,
              style: this.style
          };
      };
      return ShowCardActionConfig;
  }());
  exports.ShowCardActionConfig = ShowCardActionConfig;
  var ActionsConfig = /** @class */ (function () {
      function ActionsConfig(obj) {
          this.maxActions = 5;
          this.spacing = enums.Spacing.Default;
          this.buttonSpacing = 20;
          this.showCard = new ShowCardActionConfig();
          this.preExpandSingleShowCardAction = false;
          this.actionsOrientation = enums.Orientation.Horizontal;
          this.actionAlignment = enums.ActionAlignment.Left;
          this.iconPlacement = enums.ActionIconPlacement.LeftOfTitle;
          this.allowTitleToWrap = false;
          this.iconSize = 24;
          if (obj) {
              this.maxActions = obj["maxActions"] != null ? obj["maxActions"] : this.maxActions;
              this.spacing = utils.parseHostConfigEnum(enums.Spacing, obj.spacing && obj.spacing, enums.Spacing.Default);
              this.buttonSpacing = obj["buttonSpacing"] != null ? obj["buttonSpacing"] : this.buttonSpacing;
              this.showCard = new ShowCardActionConfig(obj["showCard"]);
              this.preExpandSingleShowCardAction = utils.getValueOrDefault(obj["preExpandSingleShowCardAction"], false);
              this.actionsOrientation = utils.parseHostConfigEnum(enums.Orientation, obj["actionsOrientation"], enums.Orientation.Horizontal);
              this.actionAlignment = utils.parseHostConfigEnum(enums.ActionAlignment, obj["actionAlignment"], enums.ActionAlignment.Left);
              this.iconPlacement = utils.parseHostConfigEnum(enums.ActionIconPlacement, obj["iconPlacement"], enums.ActionIconPlacement.LeftOfTitle);
              this.allowTitleToWrap = obj["allowTitleToWrap"] != null ? obj["allowTitleToWrap"] : this.allowTitleToWrap;
              try {
                  var sizeAndUnit = shared.SizeAndUnit.parse(obj["iconSize"]);
                  if (sizeAndUnit.unit == enums.SizeUnit.Pixel) {
                      this.iconSize = sizeAndUnit.physicalSize;
                  }
              }
              catch (e) {
                  // Swallow this, keep default icon size
              }
          }
      }
      ActionsConfig.prototype.toJSON = function () {
          return {
              maxActions: this.maxActions,
              spacing: enums.Spacing[this.spacing],
              buttonSpacing: this.buttonSpacing,
              showCard: this.showCard,
              preExpandSingleShowCardAction: this.preExpandSingleShowCardAction,
              actionsOrientation: enums.Orientation[this.actionsOrientation],
              actionAlignment: enums.ActionAlignment[this.actionAlignment]
          };
      };
      return ActionsConfig;
  }());
  exports.ActionsConfig = ActionsConfig;
  var ColorSetDefinition = /** @class */ (function () {
      function ColorSetDefinition(obj) {
          this.default = new TextColorDefinition();
          this.dark = new TextColorDefinition();
          this.light = new TextColorDefinition();
          this.accent = new TextColorDefinition();
          this.good = new TextColorDefinition();
          this.warning = new TextColorDefinition();
          this.attention = new TextColorDefinition();
          this.parse(obj);
      }
      ColorSetDefinition.prototype.parseSingleColor = function (obj, propertyName) {
          if (obj) {
              this[propertyName].parse(obj[propertyName]);
          }
      };
      ColorSetDefinition.prototype.parse = function (obj) {
          if (obj) {
              this.parseSingleColor(obj, "default");
              this.parseSingleColor(obj, "dark");
              this.parseSingleColor(obj, "light");
              this.parseSingleColor(obj, "accent");
              this.parseSingleColor(obj, "good");
              this.parseSingleColor(obj, "warning");
              this.parseSingleColor(obj, "attention");
          }
      };
      return ColorSetDefinition;
  }());
  exports.ColorSetDefinition = ColorSetDefinition;
  var ContainerStyleDefinition = /** @class */ (function () {
      function ContainerStyleDefinition(obj) {
          this.foregroundColors = new ColorSetDefinition({
              "default": { default: "#333333", subtle: "#EE333333" },
              "dark": { default: "#000000", subtle: "#66000000" },
              "light": { default: "#FFFFFF", subtle: "#33000000" },
              "accent": { default: "#2E89FC", subtle: "#882E89FC" },
              "good": { default: "#54A254", subtle: "#DD54A254" },
              "warning": { default: "#E69500", subtle: "#DDE69500" },
              "attention": { default: "#CC3300", subtle: "#DDCC3300" }
          });
          this.parse(obj);
      }
      ContainerStyleDefinition.prototype.parse = function (obj) {
          if (obj) {
              this.backgroundColor = obj["backgroundColor"];
              this.foregroundColors.parse(obj["foregroundColors"]);
              this.highlightBackgroundColor = obj["highlightBackgroundColor"];
              this.highlightForegroundColor = obj["highlightForegroundColor"];
          }
      };
      Object.defineProperty(ContainerStyleDefinition.prototype, "isBuiltIn", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      return ContainerStyleDefinition;
  }());
  exports.ContainerStyleDefinition = ContainerStyleDefinition;
  var BuiltInContainerStyleDefinition = /** @class */ (function (_super) {
      __extends(BuiltInContainerStyleDefinition, _super);
      function BuiltInContainerStyleDefinition() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Object.defineProperty(BuiltInContainerStyleDefinition.prototype, "isBuiltIn", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      return BuiltInContainerStyleDefinition;
  }(ContainerStyleDefinition));
  var ContainerStyleSet = /** @class */ (function () {
      function ContainerStyleSet(obj) {
          this._allStyles = {};
          this._allStyles[enums.ContainerStyle.Default] = new BuiltInContainerStyleDefinition();
          this._allStyles[enums.ContainerStyle.Emphasis] = new BuiltInContainerStyleDefinition();
          this._allStyles[enums.ContainerStyle.Accent] = new BuiltInContainerStyleDefinition();
          this._allStyles[enums.ContainerStyle.Good] = new BuiltInContainerStyleDefinition();
          this._allStyles[enums.ContainerStyle.Attention] = new BuiltInContainerStyleDefinition();
          this._allStyles[enums.ContainerStyle.Warning] = new BuiltInContainerStyleDefinition();
          if (obj) {
              this._allStyles[enums.ContainerStyle.Default].parse(obj[enums.ContainerStyle.Default]);
              this._allStyles[enums.ContainerStyle.Emphasis].parse(obj[enums.ContainerStyle.Emphasis]);
              this._allStyles[enums.ContainerStyle.Accent].parse(obj[enums.ContainerStyle.Accent]);
              this._allStyles[enums.ContainerStyle.Good].parse(obj[enums.ContainerStyle.Good]);
              this._allStyles[enums.ContainerStyle.Attention].parse(obj[enums.ContainerStyle.Attention]);
              this._allStyles[enums.ContainerStyle.Warning].parse(obj[enums.ContainerStyle.Warning]);
              var customStyleArray = obj["customStyles"];
              if (customStyleArray && Array.isArray(customStyleArray)) {
                  for (var _i = 0, customStyleArray_1 = customStyleArray; _i < customStyleArray_1.length; _i++) {
                      var customStyle = customStyleArray_1[_i];
                      if (customStyle) {
                          var styleName = customStyle["name"];
                          if (styleName && typeof styleName === "string") {
                              if (this._allStyles.hasOwnProperty(styleName)) {
                                  this._allStyles[styleName].parse(customStyle["style"]);
                              }
                              else {
                                  this._allStyles[styleName] = new ContainerStyleDefinition(customStyle["style"]);
                              }
                          }
                      }
                  }
              }
          }
      }
      ContainerStyleSet.prototype.toJSON = function () {
          var _this = this;
          var customStyleArray = [];
          Object.keys(this._allStyles).forEach(function (key) {
              if (!_this._allStyles[key].isBuiltIn) {
                  customStyleArray.push({
                      name: key,
                      style: _this._allStyles[key]
                  });
              }
          });
          var result = {
              default: this.default,
              emphasis: this.emphasis
          };
          if (customStyleArray.length > 0) {
              result.customStyles = customStyleArray;
          }
          return result;
      };
      ContainerStyleSet.prototype.getStyleByName = function (name, defaultValue) {
          if (defaultValue === void 0) { defaultValue = null; }
          return this._allStyles.hasOwnProperty(name) ? this._allStyles[name] : defaultValue;
      };
      Object.defineProperty(ContainerStyleSet.prototype, "default", {
          get: function () {
              return this._allStyles[enums.ContainerStyle.Default];
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ContainerStyleSet.prototype, "emphasis", {
          get: function () {
              return this._allStyles[enums.ContainerStyle.Emphasis];
          },
          enumerable: true,
          configurable: true
      });
      return ContainerStyleSet;
  }());
  exports.ContainerStyleSet = ContainerStyleSet;
  var Version = /** @class */ (function () {
      function Version(major, minor) {
          if (major === void 0) { major = 1; }
          if (minor === void 0) { minor = 1; }
          this._isValid = true;
          this._major = major;
          this._minor = minor;
      }
      Version.parse = function (versionString, errors) {
          if (!versionString) {
              return null;
          }
          var result = new Version();
          result._versionString = versionString;
          var regEx = /(\d+).(\d+)/gi;
          var matches = regEx.exec(versionString);
          if (matches != null && matches.length == 3) {
              result._major = parseInt(matches[1]);
              result._minor = parseInt(matches[2]);
          }
          else {
              result._isValid = false;
          }
          if (!result._isValid && errors) {
              errors.push({
                  error: enums.ValidationError.InvalidPropertyValue,
                  message: "Invalid version string: " + result._versionString
              });
          }
          return result;
      };
      Version.prototype.toString = function () {
          return !this._isValid ? this._versionString : this._major + "." + this._minor;
      };
      Version.prototype.compareTo = function (otherVersion) {
          if (!this.isValid || !otherVersion.isValid) {
              throw new Error("Cannot compare invalid version.");
          }
          if (this.major > otherVersion.major) {
              return 1;
          }
          else if (this.major < otherVersion.major) {
              return -1;
          }
          else if (this.minor > otherVersion.minor) {
              return 1;
          }
          else if (this.minor < otherVersion.minor) {
              return -1;
          }
          return 0;
      };
      Object.defineProperty(Version.prototype, "major", {
          get: function () {
              return this._major;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Version.prototype, "minor", {
          get: function () {
              return this._minor;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Version.prototype, "isValid", {
          get: function () {
              return this._isValid;
          },
          enumerable: true,
          configurable: true
      });
      return Version;
  }());
  exports.Version = Version;
  var HostCapabilities = /** @class */ (function () {
      function HostCapabilities() {
          this.capabilities = null;
      }
      HostCapabilities.prototype.setCapability = function (name, version) {
          if (!this.capabilities) {
              this.capabilities = {};
          }
          this.capabilities[name] = version;
      };
      HostCapabilities.prototype.parse = function (json, errors) {
          if (json) {
              for (var name_1 in json) {
                  var jsonVersion = json[name_1];
                  if (typeof jsonVersion === "string") {
                      if (jsonVersion == "*") {
                          this.setCapability(name_1, "*");
                      }
                      else {
                          var version = Version.parse(jsonVersion, errors);
                          if (version.isValid) {
                              this.setCapability(name_1, version);
                          }
                      }
                  }
              }
          }
      };
      HostCapabilities.prototype.hasCapability = function (name, version) {
          if (this.capabilities && this.capabilities.hasOwnProperty(name)) {
              if (version == "*" || this.capabilities[name] == "*") {
                  return true;
              }
              return version.compareTo(this.capabilities[name]) <= 0;
          }
          return false;
      };
      HostCapabilities.prototype.areAllMet = function (hostCapabilities) {
          if (this.capabilities) {
              for (var capabilityName in this.capabilities) {
                  if (!hostCapabilities.hasCapability(capabilityName, this.capabilities[capabilityName])) {
                      return false;
                  }
              }
          }
          return true;
      };
      return HostCapabilities;
  }());
  exports.HostCapabilities = HostCapabilities;
  var FontTypeDefinition = /** @class */ (function () {
      function FontTypeDefinition(fontFamily) {
          this.fontFamily = "Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif";
          this.fontSizes = {
              small: 12,
              default: 14,
              medium: 17,
              large: 21,
              extraLarge: 26
          };
          this.fontWeights = {
              lighter: 200,
              default: 400,
              bolder: 600
          };
          if (fontFamily) {
              this.fontFamily = fontFamily;
          }
      }
      FontTypeDefinition.prototype.parse = function (obj) {
          this.fontFamily = obj["fontFamily"] || this.fontFamily;
          this.fontSizes = {
              small: obj.fontSizes && obj.fontSizes["small"] || this.fontSizes.small,
              default: obj.fontSizes && obj.fontSizes["default"] || this.fontSizes.default,
              medium: obj.fontSizes && obj.fontSizes["medium"] || this.fontSizes.medium,
              large: obj.fontSizes && obj.fontSizes["large"] || this.fontSizes.large,
              extraLarge: obj.fontSizes && obj.fontSizes["extraLarge"] || this.fontSizes.extraLarge
          };
          this.fontWeights = {
              lighter: obj.fontWeights && obj.fontWeights["lighter"] || this.fontWeights.lighter,
              default: obj.fontWeights && obj.fontWeights["default"] || this.fontWeights.default,
              bolder: obj.fontWeights && obj.fontWeights["bolder"] || this.fontWeights.bolder
          };
      };
      FontTypeDefinition.monospace = new FontTypeDefinition("'Courier New', Courier, monospace");
      return FontTypeDefinition;
  }());
  exports.FontTypeDefinition = FontTypeDefinition;
  var FontTypeSet = /** @class */ (function () {
      function FontTypeSet(obj) {
          this.default = new FontTypeDefinition();
          this.monospace = new FontTypeDefinition("'Courier New', Courier, monospace");
          if (obj) {
              this.default.parse(obj["default"]);
              this.monospace.parse(obj["monospace"]);
          }
      }
      FontTypeSet.prototype.getStyleDefinition = function (style) {
          switch (style) {
              case enums.FontType.Monospace:
                  return this.monospace;
              case enums.FontType.Default:
              default:
                  return this.default;
          }
      };
      return FontTypeSet;
  }());
  exports.FontTypeSet = FontTypeSet;
  var HostConfig = /** @class */ (function () {
      function HostConfig(obj) {
          this.hostCapabilities = new HostCapabilities();
          this.choiceSetInputValueSeparator = ",";
          this.supportsInteractivity = true;
          this.fontTypes = null;
          this.spacing = {
              small: 3,
              default: 8,
              medium: 20,
              large: 30,
              extraLarge: 40,
              padding: 15
          };
          this.separator = {
              lineThickness: 1,
              lineColor: "#EEEEEE"
          };
          this.imageSizes = {
              small: 40,
              medium: 80,
              large: 160
          };
          this.containerStyles = new ContainerStyleSet();
          this.actions = new ActionsConfig();
          this.adaptiveCard = new AdaptiveCardConfig();
          this.imageSet = new ImageSetConfig();
          this.media = new MediaConfig();
          this.factSet = new FactSetConfig();
          this.cssClassNamePrefix = null;
          if (obj) {
              if (typeof obj === "string" || obj instanceof String) {
                  obj = JSON.parse(obj);
              }
              this.choiceSetInputValueSeparator = (obj && typeof obj["choiceSetInputValueSeparator"] === "string") ? obj["choiceSetInputValueSeparator"] : this.choiceSetInputValueSeparator;
              this.supportsInteractivity = (obj && typeof obj["supportsInteractivity"] === "boolean") ? obj["supportsInteractivity"] : this.supportsInteractivity;
              this._legacyFontType = new FontTypeDefinition();
              this._legacyFontType.parse(obj);
              if (obj.fontTypes) {
                  this.fontTypes = new FontTypeSet(obj.fontTypes);
              }
              if (obj.lineHeights) {
                  this.lineHeights = {
                      small: obj.lineHeights["small"],
                      default: obj.lineHeights["default"],
                      medium: obj.lineHeights["medium"],
                      large: obj.lineHeights["large"],
                      extraLarge: obj.lineHeights["extraLarge"]
                  };
              }
              this.imageSizes = {
                  small: obj.imageSizes && obj.imageSizes["small"] || this.imageSizes.small,
                  medium: obj.imageSizes && obj.imageSizes["medium"] || this.imageSizes.medium,
                  large: obj.imageSizes && obj.imageSizes["large"] || this.imageSizes.large,
              };
              this.containerStyles = new ContainerStyleSet(obj["containerStyles"]);
              this.spacing = {
                  small: obj.spacing && obj.spacing["small"] || this.spacing.small,
                  default: obj.spacing && obj.spacing["default"] || this.spacing.default,
                  medium: obj.spacing && obj.spacing["medium"] || this.spacing.medium,
                  large: obj.spacing && obj.spacing["large"] || this.spacing.large,
                  extraLarge: obj.spacing && obj.spacing["extraLarge"] || this.spacing.extraLarge,
                  padding: obj.spacing && obj.spacing["padding"] || this.spacing.padding
              };
              this.separator = {
                  lineThickness: obj.separator && obj.separator["lineThickness"] || this.separator.lineThickness,
                  lineColor: obj.separator && obj.separator["lineColor"] || this.separator.lineColor
              };
              this.actions = new ActionsConfig(obj.actions || this.actions);
              this.adaptiveCard = new AdaptiveCardConfig(obj.adaptiveCard || this.adaptiveCard);
              this.imageSet = new ImageSetConfig(obj["imageSet"]);
              this.factSet = new FactSetConfig(obj["factSet"]);
          }
      }
      HostConfig.prototype.getFontTypeDefinition = function (style) {
          if (this.fontTypes) {
              return this.fontTypes.getStyleDefinition(style);
          }
          else {
              return style == enums.FontType.Monospace ? FontTypeDefinition.monospace : this._legacyFontType;
          }
      };
      HostConfig.prototype.getEffectiveSpacing = function (spacing) {
          switch (spacing) {
              case enums.Spacing.Small:
                  return this.spacing.small;
              case enums.Spacing.Default:
                  return this.spacing.default;
              case enums.Spacing.Medium:
                  return this.spacing.medium;
              case enums.Spacing.Large:
                  return this.spacing.large;
              case enums.Spacing.ExtraLarge:
                  return this.spacing.extraLarge;
              case enums.Spacing.Padding:
                  return this.spacing.padding;
              default:
                  return 0;
          }
      };
      HostConfig.prototype.paddingDefinitionToSpacingDefinition = function (paddingDefinition) {
          return new shared.SpacingDefinition(this.getEffectiveSpacing(paddingDefinition.top), this.getEffectiveSpacing(paddingDefinition.right), this.getEffectiveSpacing(paddingDefinition.bottom), this.getEffectiveSpacing(paddingDefinition.left));
      };
      HostConfig.prototype.makeCssClassNames = function () {
          var classNames = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              classNames[_i] = arguments[_i];
          }
          var result = [];
          for (var _a = 0, classNames_1 = classNames; _a < classNames_1.length; _a++) {
              var className = classNames_1[_a];
              result.push((this.cssClassNamePrefix ? this.cssClassNamePrefix + "-" : "") + className);
          }
          return result;
      };
      HostConfig.prototype.makeCssClassName = function () {
          var classNames = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              classNames[_i] = arguments[_i];
          }
          var result = this.makeCssClassNames.apply(this, classNames).join(" ");
          return result ? result : "";
      };
      Object.defineProperty(HostConfig.prototype, "fontFamily", {
          get: function () {
              return this._legacyFontType.fontFamily;
          },
          set: function (value) {
              this._legacyFontType.fontFamily = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(HostConfig.prototype, "fontSizes", {
          get: function () {
              return this._legacyFontType.fontSizes;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(HostConfig.prototype, "fontWeights", {
          get: function () {
              return this._legacyFontType.fontWeights;
          },
          enumerable: true,
          configurable: true
      });
      return HostConfig;
  }());
  exports.HostConfig = HostConfig;
  //# sourceMappingURL=host-config.js.map
  });

  unwrapExports(hostConfig);
  var hostConfig_1 = hostConfig.ColorDefinition;
  var hostConfig_2 = hostConfig.TextColorDefinition;
  var hostConfig_3 = hostConfig.AdaptiveCardConfig;
  var hostConfig_4 = hostConfig.ImageSetConfig;
  var hostConfig_5 = hostConfig.MediaConfig;
  var hostConfig_6 = hostConfig.FactTextDefinition;
  var hostConfig_7 = hostConfig.FactTitleDefinition;
  var hostConfig_8 = hostConfig.FactSetConfig;
  var hostConfig_9 = hostConfig.ShowCardActionConfig;
  var hostConfig_10 = hostConfig.ActionsConfig;
  var hostConfig_11 = hostConfig.ColorSetDefinition;
  var hostConfig_12 = hostConfig.ContainerStyleDefinition;
  var hostConfig_13 = hostConfig.ContainerStyleSet;
  var hostConfig_14 = hostConfig.Version;
  var hostConfig_15 = hostConfig.HostCapabilities;
  var hostConfig_16 = hostConfig.FontTypeDefinition;
  var hostConfig_17 = hostConfig.FontTypeSet;
  var hostConfig_18 = hostConfig.HostConfig;

  var textFormatters = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });
  // Copyright (c) Microsoft Corporation. All rights reserved.
  // Licensed under the MIT License.
  var AbstractTextFormatter = /** @class */ (function () {
      function AbstractTextFormatter(regularExpression) {
          this._regularExpression = regularExpression;
      }
      AbstractTextFormatter.prototype.format = function (lang, input) {
          var matches;
          var result = input;
          while ((matches = this._regularExpression.exec(input)) != null) {
              result = result.replace(matches[0], this.internalFormat(lang, matches));
          }
          return result;
      };
      return AbstractTextFormatter;
  }());
  var DateFormatter = /** @class */ (function (_super) {
      __extends(DateFormatter, _super);
      function DateFormatter() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      DateFormatter.prototype.internalFormat = function (lang, matches) {
          var date = new Date(Date.parse(matches[1]));
          var format = matches[2] != undefined ? matches[2].toLowerCase() : "compact";
          if (format != "compact") {
              return date.toLocaleDateString(lang, { day: "numeric", weekday: format, month: format, year: "numeric" });
          }
          else {
              return date.toLocaleDateString();
          }
      };
      return DateFormatter;
  }(AbstractTextFormatter));
  var TimeFormatter = /** @class */ (function (_super) {
      __extends(TimeFormatter, _super);
      function TimeFormatter() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      TimeFormatter.prototype.internalFormat = function (lang, matches) {
          var date = new Date(Date.parse(matches[1]));
          return date.toLocaleTimeString(lang, { hour: 'numeric', minute: '2-digit' });
      };
      return TimeFormatter;
  }(AbstractTextFormatter));
  function formatText(lang, text) {
      var formatters = [
          new DateFormatter(/\{{2}DATE\((\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|(?:(?:-|\+)\d{2}:\d{2})))(?:, ?(COMPACT|LONG|SHORT))?\)\}{2}/g),
          new TimeFormatter(/\{{2}TIME\((\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|(?:(?:-|\+)\d{2}:\d{2})))\)\}{2}/g)
      ];
      var result = text;
      for (var i = 0; i < formatters.length; i++) {
          result = formatters[i].format(lang, result);
      }
      return result;
  }
  exports.formatText = formatText;
  //# sourceMappingURL=text-formatters.js.map
  });

  unwrapExports(textFormatters);
  var textFormatters_1 = textFormatters.formatText;

  var cardElements = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });
  // Copyright (c) Microsoft Corporation. All rights reserved.
  // Licensed under the MIT License.





  function invokeSetCollection(action, collection) {
      if (action) {
          // Closest emulation of "internal" in TypeScript.
          action["setCollection"](collection);
      }
  }
  function isActionAllowed(action, forbiddenActionTypes) {
      if (forbiddenActionTypes) {
          for (var i = 0; i < forbiddenActionTypes.length; i++) {
              if (action.getJsonTypeName() === forbiddenActionTypes[i]) {
                  return false;
              }
          }
      }
      return true;
  }
  var InstanceCreationErrorType;
  (function (InstanceCreationErrorType) {
      InstanceCreationErrorType[InstanceCreationErrorType["UnknownType"] = 0] = "UnknownType";
      InstanceCreationErrorType[InstanceCreationErrorType["ForbiddenType"] = 1] = "ForbiddenType";
  })(InstanceCreationErrorType || (InstanceCreationErrorType = {}));
  function createCardObjectInstance(parent, json, forbiddenTypeNames, allowFallback, createInstanceCallback, createValidationErrorCallback, errors) {
      var result = null;
      if (json && typeof json === "object") {
          var tryToFallback = false;
          var typeName = utils.getStringValue(json["type"]);
          if (forbiddenTypeNames && forbiddenTypeNames.indexOf(typeName) >= 0) {
              raiseParseError(createValidationErrorCallback(typeName, InstanceCreationErrorType.ForbiddenType), errors);
          }
          else {
              result = createInstanceCallback(typeName);
              if (!result) {
                  tryToFallback = allowFallback;
                  raiseParseError(createValidationErrorCallback(typeName, InstanceCreationErrorType.UnknownType), errors);
              }
              else {
                  result.setParent(parent);
                  result.parse(json, errors);
                  tryToFallback = result.shouldFallback() && allowFallback;
              }
              if (tryToFallback) {
                  var fallback = json["fallback"];
                  if (!fallback) {
                      parent.setShouldFallback(true);
                  }
                  if (typeof fallback === "string" && fallback.toLowerCase() === "drop") {
                      result = null;
                  }
                  else if (typeof fallback === "object") {
                      result = createCardObjectInstance(parent, fallback, forbiddenTypeNames, true, createInstanceCallback, createValidationErrorCallback, errors);
                  }
              }
          }
      }
      return result;
  }
  function createActionInstance(parent, json, forbiddenActionTypes, allowFallback, errors) {
      return createCardObjectInstance(parent, json, forbiddenActionTypes, allowFallback, function (typeName) { return AdaptiveCard.actionTypeRegistry.createInstance(typeName); }, function (typeName, errorType) {
          if (errorType == InstanceCreationErrorType.UnknownType) {
              return {
                  error: enums.ValidationError.UnknownActionType,
                  message: "Unknown action type: " + typeName + ". Fallback will be used if present."
              };
          }
          else {
              return {
                  error: enums.ValidationError.ActionTypeNotAllowed,
                  message: "Action type " + typeName + " is not allowed in this context."
              };
          }
      }, errors);
  }
  exports.createActionInstance = createActionInstance;
  function createElementInstance(parent, json, allowFallback, errors) {
      return createCardObjectInstance(parent, json, [], // Forbidden types not supported for elements for now
      allowFallback, function (typeName) { return AdaptiveCard.elementTypeRegistry.createInstance(typeName); }, function (typeName, errorType) {
          if (errorType == InstanceCreationErrorType.UnknownType) {
              return {
                  error: enums.ValidationError.UnknownElementType,
                  message: "Unknown element type: " + typeName + ". Fallback will be used if present."
              };
          }
          else {
              return {
                  error: enums.ValidationError.ElementTypeNotAllowed,
                  message: "Element type " + typeName + " is not allowed in this context."
              };
          }
      }, errors);
  }
  exports.createElementInstance = createElementInstance;
  var SerializableObject = /** @class */ (function () {
      function SerializableObject() {
          this._rawProperties = {};
      }
      SerializableObject.prototype.parse = function (json, errors) {
          this._rawProperties = AdaptiveCard.enableFullJsonRoundTrip ? json : {};
      };
      SerializableObject.prototype.toJSON = function () {
          var result;
          if (AdaptiveCard.enableFullJsonRoundTrip && this._rawProperties && typeof this._rawProperties === "object") {
              result = this._rawProperties;
          }
          else {
              result = {};
          }
          return result;
      };
      SerializableObject.prototype.setCustomProperty = function (name, value) {
          this._rawProperties[name] = value;
      };
      SerializableObject.prototype.getCustomProperty = function (name) {
          return this._rawProperties[name];
      };
      return SerializableObject;
  }());
  exports.SerializableObject = SerializableObject;
  var ValidationFailure = /** @class */ (function () {
      function ValidationFailure(cardObject) {
          this.cardObject = cardObject;
          this.errors = [];
      }
      return ValidationFailure;
  }());
  exports.ValidationFailure = ValidationFailure;
  var ValidationResults = /** @class */ (function () {
      function ValidationResults() {
          this.allIds = {};
          this.failures = [];
      }
      ValidationResults.prototype.getFailureIndex = function (cardObject) {
          for (var i = 0; i < this.failures.length; i++) {
              if (this.failures[i].cardObject === cardObject) {
                  return i;
              }
          }
          return -1;
      };
      ValidationResults.prototype.addFailure = function (cardObject, error) {
          var index = this.getFailureIndex(cardObject);
          var failure;
          if (index < 0) {
              failure = new ValidationFailure(cardObject);
              this.failures.push(failure);
          }
          else {
              failure = this.failures[index];
          }
          failure.errors.push(error);
      };
      return ValidationResults;
  }());
  exports.ValidationResults = ValidationResults;
  var CardObject = /** @class */ (function (_super) {
      __extends(CardObject, _super);
      function CardObject() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CardObject.prototype.internalValidateProperties = function (context) {
          if (!utils.isNullOrEmpty(this.id)) {
              if (context.allIds.hasOwnProperty(this.id)) {
                  if (context.allIds[this.id] == 1) {
                      context.addFailure(this, {
                          error: enums.ValidationError.DuplicateId,
                          message: "Duplicate Id: " + this.id
                      });
                  }
                  context.allIds[this.id] += 1;
              }
              else {
                  context.allIds[this.id] = 1;
              }
          }
      };
      CardObject.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.id = utils.getStringValue(json["id"]);
      };
      CardObject.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "type", this.getJsonTypeName());
          utils.setProperty(result, "id", this.id);
          return result;
      };
      CardObject.prototype.validateProperties = function () {
          var result = new ValidationResults();
          this.internalValidateProperties(result);
          return result;
      };
      return CardObject;
  }(SerializableObject));
  exports.CardObject = CardObject;
  var CardElement = /** @class */ (function (_super) {
      __extends(CardElement, _super);
      function CardElement() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._shouldFallback = false;
          _this._lang = undefined;
          _this._hostConfig = null;
          _this._parent = null;
          _this._renderedElement = null;
          _this._separatorElement = null;
          _this._isVisible = true;
          _this._truncatedDueToOverflow = false;
          _this._defaultRenderedElementDisplayMode = null;
          _this._padding = null;
          _this.requires = new hostConfig.HostCapabilities();
          _this.horizontalAlignment = null;
          _this.spacing = enums.Spacing.Default;
          _this.separator = false;
          _this.customCssSelector = null;
          _this.height = "auto";
          _this.minPixelHeight = null;
          return _this;
      }
      CardElement.prototype.internalRenderSeparator = function () {
          var renderedSeparator = utils.renderSeparation(this.hostConfig, {
              spacing: this.hostConfig.getEffectiveSpacing(this.spacing),
              lineThickness: this.separator ? this.hostConfig.separator.lineThickness : null,
              lineColor: this.separator ? this.hostConfig.separator.lineColor : null
          }, this.separatorOrientation);
          return renderedSeparator;
      };
      CardElement.prototype.updateRenderedElementVisibility = function () {
          var displayMode = this.isDesignMode() || this.isVisible ? this._defaultRenderedElementDisplayMode : "none";
          if (this._renderedElement) {
              this._renderedElement.style.display = displayMode;
          }
          if (this._separatorElement) {
              if (this.parent && this.parent.isFirstElement(this)) {
                  this._separatorElement.style.display = "none";
              }
              else {
                  this._separatorElement.style.display = displayMode;
              }
          }
      };
      CardElement.prototype.hideElementDueToOverflow = function () {
          if (this._renderedElement && this.isVisible) {
              this._renderedElement.style.visibility = 'hidden';
              this.isVisible = false;
              raiseElementVisibilityChangedEvent(this, false);
          }
      };
      CardElement.prototype.showElementHiddenDueToOverflow = function () {
          if (this._renderedElement && !this.isVisible) {
              this._renderedElement.style.visibility = null;
              this.isVisible = true;
              raiseElementVisibilityChangedEvent(this, false);
          }
      };
      // Marked private to emulate internal access
      CardElement.prototype.handleOverflow = function (maxHeight) {
          if (this.isVisible || this.isHiddenDueToOverflow()) {
              var handled = this.truncateOverflow(maxHeight);
              // Even if we were unable to truncate the element to fit this time,
              // it still could have been previously truncated
              this._truncatedDueToOverflow = handled || this._truncatedDueToOverflow;
              if (!handled) {
                  this.hideElementDueToOverflow();
              }
              else if (handled && !this.isVisible) {
                  this.showElementHiddenDueToOverflow();
              }
          }
      };
      // Marked private to emulate internal access
      CardElement.prototype.resetOverflow = function () {
          var sizeChanged = false;
          if (this._truncatedDueToOverflow) {
              this.undoOverflowTruncation();
              this._truncatedDueToOverflow = false;
              sizeChanged = true;
          }
          if (this.isHiddenDueToOverflow) {
              this.showElementHiddenDueToOverflow();
          }
          return sizeChanged;
      };
      CardElement.prototype.createPlaceholderElement = function () {
          var element = document.createElement("div");
          element.style.border = "1px dashed #DDDDDD";
          element.style.padding = "4px";
          element.style.minHeight = "32px";
          element.style.fontSize = "10px";
          element.innerText = "Empty " + this.getJsonTypeName();
          return element;
      };
      CardElement.prototype.adjustRenderedElementSize = function (renderedElement) {
          if (this.height === "auto") {
              renderedElement.style.flex = "0 0 auto";
          }
          else {
              renderedElement.style.flex = "1 1 auto";
          }
          if (this.minPixelHeight) {
              renderedElement.style.minHeight = this.minPixelHeight + "px";
          }
      };
      CardElement.prototype.overrideInternalRender = function () {
          return this.internalRender();
      };
      CardElement.prototype.applyPadding = function () {
          if (this.separatorElement) {
              if (AdaptiveCard.alwaysBleedSeparators && this.separatorOrientation == enums.Orientation.Horizontal && !this.isBleeding()) {
                  var padding = new shared.PaddingDefinition();
                  this.getImmediateSurroundingPadding(padding);
                  var physicalPadding = this.hostConfig.paddingDefinitionToSpacingDefinition(padding);
                  this.separatorElement.style.marginLeft = "-" + physicalPadding.left + "px";
                  this.separatorElement.style.marginRight = "-" + physicalPadding.right + "px";
              }
              else {
                  this.separatorElement.style.marginRight = "0";
                  this.separatorElement.style.marginLeft = "0";
              }
          }
      };
      /*
       * Called when this element overflows the bottom of the card.
       * maxHeight will be the amount of space still available on the card (0 if
       * the element is fully off the card).
       */
      CardElement.prototype.truncateOverflow = function (maxHeight) {
          // Child implementations should return true if the element handled
          // the truncation request such that its content fits within maxHeight,
          // false if the element should fall back to being hidden
          return false;
      };
      /*
       * This should reverse any changes performed in truncateOverflow().
       */
      CardElement.prototype.undoOverflowTruncation = function () { };
      CardElement.prototype.getDefaultPadding = function () {
          return new shared.PaddingDefinition();
      };
      CardElement.prototype.getHasBackground = function () {
          return false;
      };
      CardElement.prototype.getPadding = function () {
          return this._padding;
      };
      CardElement.prototype.setPadding = function (value) {
          this._padding = value;
      };
      Object.defineProperty(CardElement.prototype, "supportsMinHeight", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "useDefaultSizing", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "allowCustomPadding", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "separatorOrientation", {
          get: function () {
              return enums.Orientation.Horizontal;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "defaultStyle", {
          get: function () {
              return enums.ContainerStyle.Default;
          },
          enumerable: true,
          configurable: true
      });
      CardElement.prototype.asString = function () {
          return "";
      };
      CardElement.prototype.isBleeding = function () {
          return false;
      };
      CardElement.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "isVisible", this.isVisible, true);
          if (this.horizontalAlignment !== null) {
              utils.setEnumProperty(enums.HorizontalAlignment, result, "horizontalAlignment", this.horizontalAlignment);
          }
          utils.setEnumProperty(enums.Spacing, result, "spacing", this.spacing, enums.Spacing.Default);
          utils.setProperty(result, "separator", this.separator, false);
          utils.setProperty(result, "height", this.height, "auto");
          if (this.minPixelHeight) {
              utils.setProperty(result, "minHeight", this.minPixelHeight + "px");
          }
          return result;
      };
      CardElement.prototype.setParent = function (value) {
          this._parent = value;
      };
      CardElement.prototype.getEffectiveStyle = function () {
          if (this.parent) {
              return this.parent.getEffectiveStyle();
          }
          return this.defaultStyle;
      };
      CardElement.prototype.getForbiddenElementTypes = function () {
          return null;
      };
      CardElement.prototype.getForbiddenActionTypes = function () {
          return null;
      };
      CardElement.prototype.getImmediateSurroundingPadding = function (result, processTop, processRight, processBottom, processLeft) {
          if (processTop === void 0) { processTop = true; }
          if (processRight === void 0) { processRight = true; }
          if (processBottom === void 0) { processBottom = true; }
          if (processLeft === void 0) { processLeft = true; }
          if (this.parent) {
              var doProcessTop = processTop && this.parent.isTopElement(this);
              var doProcessRight = processRight && this.parent.isRightMostElement(this);
              var doProcessBottom = processBottom && this.parent.isBottomElement(this);
              var doProcessLeft = processLeft && this.parent.isLeftMostElement(this);
              var effectivePadding = this.parent.getEffectivePadding();
              if (effectivePadding) {
                  if (doProcessTop && effectivePadding.top != enums.Spacing.None) {
                      result.top = effectivePadding.top;
                      doProcessTop = false;
                  }
                  if (doProcessRight && effectivePadding.right != enums.Spacing.None) {
                      result.right = effectivePadding.right;
                      doProcessRight = false;
                  }
                  if (doProcessBottom && effectivePadding.bottom != enums.Spacing.None) {
                      result.bottom = effectivePadding.bottom;
                      doProcessBottom = false;
                  }
                  if (doProcessLeft && effectivePadding.left != enums.Spacing.None) {
                      result.left = effectivePadding.left;
                      doProcessLeft = false;
                  }
              }
              if (doProcessTop || doProcessRight || doProcessBottom || doProcessLeft) {
                  this.parent.getImmediateSurroundingPadding(result, doProcessTop, doProcessRight, doProcessBottom, doProcessLeft);
              }
          }
      };
      CardElement.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          raiseParseElementEvent(this, json, errors);
          this.requires.parse(json["requires"], errors);
          this.isVisible = utils.getBoolValue(json["isVisible"], this.isVisible);
          this.horizontalAlignment = utils.getEnumValue(enums.HorizontalAlignment, json["horizontalAlignment"], this.horizontalAlignment);
          this.spacing = utils.getEnumValue(enums.Spacing, json["spacing"], enums.Spacing.Default);
          this.separator = utils.getBoolValue(json["separator"], this.separator);
          var jsonSeparation = json["separation"];
          if (jsonSeparation !== undefined) {
              if (jsonSeparation === "none") {
                  this.spacing = enums.Spacing.None;
                  this.separator = false;
              }
              else if (jsonSeparation === "strong") {
                  this.spacing = enums.Spacing.Large;
                  this.separator = true;
              }
              else if (jsonSeparation === "default") {
                  this.spacing = enums.Spacing.Default;
                  this.separator = false;
              }
              raiseParseError({
                  error: enums.ValidationError.Deprecated,
                  message: "The \"separation\" property is deprecated and will be removed. Use the \"spacing\" and \"separator\" properties instead."
              }, errors);
          }
          var jsonHeight = json["height"];
          if (jsonHeight === "auto" || jsonHeight === "stretch") {
              this.height = jsonHeight;
          }
          if (this.supportsMinHeight) {
              var jsonMinHeight = json["minHeight"];
              if (jsonMinHeight && typeof jsonMinHeight === "string") {
                  var isValid = false;
                  try {
                      var size = shared.SizeAndUnit.parse(jsonMinHeight, true);
                      if (size.unit == enums.SizeUnit.Pixel) {
                          this.minPixelHeight = size.physicalSize;
                          isValid = true;
                      }
                  }
                  catch (_a) {
                      // Do nothing. A parse error is emitted below
                  }
                  if (!isValid) {
                      raiseParseError({
                          error: enums.ValidationError.InvalidPropertyValue,
                          message: "Invalid \"minHeight\" value: " + jsonMinHeight
                      }, errors);
                  }
              }
          }
      };
      CardElement.prototype.getActionCount = function () {
          return 0;
      };
      CardElement.prototype.getActionAt = function (index) {
          throw new Error("Index out of range.");
      };
      CardElement.prototype.remove = function () {
          if (this.parent && this.parent instanceof CardElementContainer) {
              return this.parent.removeItem(this);
          }
          return false;
      };
      CardElement.prototype.render = function () {
          this._renderedElement = this.overrideInternalRender();
          this._separatorElement = this.internalRenderSeparator();
          if (this._renderedElement) {
              if (this.customCssSelector) {
                  this._renderedElement.classList.add(this.customCssSelector);
              }
              this._renderedElement.style.boxSizing = "border-box";
              this._defaultRenderedElementDisplayMode = this._renderedElement.style.display;
              this.adjustRenderedElementSize(this._renderedElement);
              this.updateLayout(false);
          }
          else if (this.isDesignMode()) {
              this._renderedElement = this.createPlaceholderElement();
          }
          return this._renderedElement;
      };
      CardElement.prototype.updateLayout = function (processChildren) {
          this.updateRenderedElementVisibility();
          this.applyPadding();
      };
      CardElement.prototype.indexOf = function (cardElement) {
          return -1;
      };
      CardElement.prototype.isDesignMode = function () {
          var rootElement = this.getRootElement();
          return rootElement instanceof AdaptiveCard && rootElement.designMode;
      };
      CardElement.prototype.isRendered = function () {
          return this._renderedElement && this._renderedElement.offsetHeight > 0;
      };
      CardElement.prototype.isFirstElement = function (element) {
          return true;
      };
      CardElement.prototype.isLastElement = function (element) {
          return true;
      };
      CardElement.prototype.isAtTheVeryLeft = function () {
          return this.parent ? this.parent.isLeftMostElement(this) && this.parent.isAtTheVeryLeft() : true;
      };
      CardElement.prototype.isAtTheVeryRight = function () {
          return this.parent ? this.parent.isRightMostElement(this) && this.parent.isAtTheVeryRight() : true;
      };
      CardElement.prototype.isAtTheVeryTop = function () {
          return this.parent ? this.parent.isFirstElement(this) && this.parent.isAtTheVeryTop() : true;
      };
      CardElement.prototype.isAtTheVeryBottom = function () {
          return this.parent ? this.parent.isLastElement(this) && this.parent.isAtTheVeryBottom() : true;
      };
      CardElement.prototype.isBleedingAtTop = function () {
          return false;
      };
      CardElement.prototype.isBleedingAtBottom = function () {
          return false;
      };
      CardElement.prototype.isLeftMostElement = function (element) {
          return true;
      };
      CardElement.prototype.isRightMostElement = function (element) {
          return true;
      };
      CardElement.prototype.isTopElement = function (element) {
          return this.isFirstElement(element);
      };
      CardElement.prototype.isBottomElement = function (element) {
          return this.isLastElement(element);
      };
      CardElement.prototype.isHiddenDueToOverflow = function () {
          return this._renderedElement && this._renderedElement.style.visibility == 'hidden';
      };
      CardElement.prototype.getRootElement = function () {
          var rootElement = this;
          while (rootElement.parent) {
              rootElement = rootElement.parent;
          }
          return rootElement;
      };
      CardElement.prototype.getParentContainer = function () {
          var currentElement = this.parent;
          while (currentElement) {
              if (currentElement instanceof Container) {
                  return currentElement;
              }
              currentElement = currentElement.parent;
          }
          return null;
      };
      CardElement.prototype.getAllInputs = function () {
          return [];
      };
      CardElement.prototype.getResourceInformation = function () {
          return [];
      };
      CardElement.prototype.getElementById = function (id) {
          return this.id === id ? this : null;
      };
      CardElement.prototype.getActionById = function (id) {
          return null;
      };
      CardElement.prototype.shouldFallback = function () {
          return this._shouldFallback || !this.requires.areAllMet(this.hostConfig.hostCapabilities);
      };
      CardElement.prototype.setShouldFallback = function (value) {
          this._shouldFallback = value;
      };
      CardElement.prototype.getEffectivePadding = function () {
          var padding = this.getPadding();
          return (padding && this.allowCustomPadding) ? padding : this.getDefaultPadding();
      };
      Object.defineProperty(CardElement.prototype, "lang", {
          get: function () {
              if (this._lang) {
                  return this._lang;
              }
              else {
                  if (this.parent) {
                      return this.parent.lang;
                  }
                  else {
                      return undefined;
                  }
              }
          },
          set: function (value) {
              if (value && value != "") {
                  var regEx = /^[a-z]{2,3}$/ig;
                  var matches = regEx.exec(value);
                  if (!matches) {
                      throw new Error("Invalid language identifier: " + value);
                  }
              }
              this._lang = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "hostConfig", {
          get: function () {
              if (this._hostConfig) {
                  return this._hostConfig;
              }
              else {
                  if (this.parent) {
                      return this.parent.hostConfig;
                  }
                  else {
                      return defaultHostConfig;
                  }
              }
          },
          set: function (value) {
              this._hostConfig = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "index", {
          get: function () {
              if (this.parent) {
                  return this.parent.indexOf(this);
              }
              else {
                  return 0;
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "isInteractive", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "isStandalone", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "isInline", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "parent", {
          get: function () {
              return this._parent;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "isVisible", {
          get: function () {
              return this._isVisible;
          },
          set: function (value) {
              // If the element is going to be hidden, reset any changes that were due
              // to overflow truncation (this ensures that if the element is later
              // un-hidden it has the right content)
              if (AdaptiveCard.useAdvancedCardBottomTruncation && !value) {
                  this.undoOverflowTruncation();
              }
              if (this._isVisible != value) {
                  this._isVisible = value;
                  this.updateRenderedElementVisibility();
                  if (this._renderedElement) {
                      raiseElementVisibilityChangedEvent(this);
                  }
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "hasVisibleSeparator", {
          get: function () {
              if (this.parent && this.separatorElement) {
                  return !this.parent.isFirstElement(this) && (this.isVisible || this.isDesignMode());
              }
              else {
                  return false;
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "renderedElement", {
          get: function () {
              return this._renderedElement;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CardElement.prototype, "separatorElement", {
          get: function () {
              return this._separatorElement;
          },
          enumerable: true,
          configurable: true
      });
      return CardElement;
  }(CardObject));
  exports.CardElement = CardElement;
  var BaseTextBlock = /** @class */ (function (_super) {
      __extends(BaseTextBlock, _super);
      function BaseTextBlock() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._selectAction = null;
          _this.size = enums.TextSize.Default;
          _this.weight = enums.TextWeight.Default;
          _this.color = enums.TextColor.Default;
          _this.isSubtle = false;
          _this.fontType = null;
          return _this;
      }
      BaseTextBlock.prototype.getEffectiveStyleDefinition = function () {
          return this.hostConfig.containerStyles.getStyleByName(this.getEffectiveStyle());
      };
      BaseTextBlock.prototype.getFontSize = function (fontType) {
          switch (this.size) {
              case enums.TextSize.Small:
                  return fontType.fontSizes.small;
              case enums.TextSize.Medium:
                  return fontType.fontSizes.medium;
              case enums.TextSize.Large:
                  return fontType.fontSizes.large;
              case enums.TextSize.ExtraLarge:
                  return fontType.fontSizes.extraLarge;
              default:
                  return fontType.fontSizes.default;
          }
      };
      BaseTextBlock.prototype.getColorDefinition = function (colorSet, color) {
          switch (color) {
              case enums.TextColor.Accent:
                  return colorSet.accent;
              case enums.TextColor.Dark:
                  return colorSet.dark;
              case enums.TextColor.Light:
                  return colorSet.light;
              case enums.TextColor.Good:
                  return colorSet.good;
              case enums.TextColor.Warning:
                  return colorSet.warning;
              case enums.TextColor.Attention:
                  return colorSet.attention;
              default:
                  return colorSet.default;
          }
      };
      BaseTextBlock.prototype.setText = function (value) {
          this._text = value;
      };
      BaseTextBlock.prototype.asString = function () {
          return this.text;
      };
      BaseTextBlock.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setEnumProperty(enums.TextSize, result, "size", this.size, enums.TextSize.Default);
          utils.setEnumProperty(enums.TextWeight, result, "weight", this.weight, enums.TextWeight.Default);
          utils.setEnumProperty(enums.TextColor, result, "color", this.color, enums.TextColor.Default);
          utils.setProperty(result, "text", this.text);
          utils.setProperty(result, "isSubtle", this.isSubtle, false);
          utils.setEnumProperty(enums.FontType, result, "fontType", this.fontType, enums.FontType.Default);
          return result;
      };
      BaseTextBlock.prototype.applyStylesTo = function (targetElement) {
          var fontType = this.hostConfig.getFontTypeDefinition(this.fontType);
          if (fontType.fontFamily) {
              targetElement.style.fontFamily = fontType.fontFamily;
          }
          var fontSize;
          switch (this.size) {
              case enums.TextSize.Small:
                  fontSize = fontType.fontSizes.small;
                  break;
              case enums.TextSize.Medium:
                  fontSize = fontType.fontSizes.medium;
                  break;
              case enums.TextSize.Large:
                  fontSize = fontType.fontSizes.large;
                  break;
              case enums.TextSize.ExtraLarge:
                  fontSize = fontType.fontSizes.extraLarge;
                  break;
              default:
                  fontSize = fontType.fontSizes.default;
                  break;
          }
          targetElement.style.fontSize = fontSize + "px";
          var colorDefinition = this.getColorDefinition(this.getEffectiveStyleDefinition().foregroundColors, this.effectiveColor);
          targetElement.style.color = utils.stringToCssColor(this.isSubtle ? colorDefinition.subtle : colorDefinition.default);
          var fontWeight;
          switch (this.weight) {
              case enums.TextWeight.Lighter:
                  fontWeight = fontType.fontWeights.lighter;
                  break;
              case enums.TextWeight.Bolder:
                  fontWeight = fontType.fontWeights.bolder;
                  break;
              default:
                  fontWeight = fontType.fontWeights.default;
                  break;
          }
          targetElement.style.fontWeight = fontWeight.toString();
      };
      BaseTextBlock.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.text = utils.getStringValue(json["text"]);
          var sizeString = utils.getStringValue(json["size"]);
          if (sizeString && sizeString.toLowerCase() === "normal") {
              this.size = enums.TextSize.Default;
              raiseParseError({
                  error: enums.ValidationError.Deprecated,
                  message: "The TextBlock.size value \"normal\" is deprecated and will be removed. Use \"default\" instead."
              }, errors);
          }
          else {
              this.size = utils.getEnumValue(enums.TextSize, sizeString, this.size);
          }
          var weightString = utils.getStringValue(json["weight"]);
          if (weightString && weightString.toLowerCase() === "normal") {
              this.weight = enums.TextWeight.Default;
              raiseParseError({
                  error: enums.ValidationError.Deprecated,
                  message: "The TextBlock.weight value \"normal\" is deprecated and will be removed. Use \"default\" instead."
              }, errors);
          }
          else {
              this.weight = utils.getEnumValue(enums.TextWeight, weightString, this.weight);
          }
          this.color = utils.getEnumValue(enums.TextColor, json["color"], this.color);
          this.isSubtle = utils.getBoolValue(json["isSubtle"], this.isSubtle);
          this.fontType = utils.getEnumValue(enums.FontType, json["fontType"], this.fontType);
      };
      Object.defineProperty(BaseTextBlock.prototype, "effectiveColor", {
          get: function () {
              return this.color ? this.color : enums.TextColor.Default;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(BaseTextBlock.prototype, "text", {
          get: function () {
              return this._text;
          },
          set: function (value) {
              this.setText(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(BaseTextBlock.prototype, "selectAction", {
          get: function () {
              return this._selectAction;
          },
          set: function (value) {
              this._selectAction = value;
              if (this._selectAction) {
                  this._selectAction.setParent(this);
              }
          },
          enumerable: true,
          configurable: true
      });
      return BaseTextBlock;
  }(CardElement));
  exports.BaseTextBlock = BaseTextBlock;
  var TextBlock = /** @class */ (function (_super) {
      __extends(TextBlock, _super);
      function TextBlock() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._processedText = null;
          _this._treatAsPlainText = true;
          _this.wrap = false;
          _this.useMarkdown = true;
          return _this;
      }
      TextBlock.prototype.restoreOriginalContent = function () {
          var maxHeight = this.maxLines
              ? (this._computedLineHeight * this.maxLines) + 'px'
              : null;
          this.renderedElement.style.maxHeight = maxHeight;
          this.renderedElement.innerHTML = this._originalInnerHtml;
      };
      TextBlock.prototype.truncateIfSupported = function (maxHeight) {
          // For now, only truncate TextBlocks that contain just a single
          // paragraph -- since the maxLines calculation doesn't take into
          // account Markdown lists
          var children = this.renderedElement.children;
          var isTextOnly = !children.length;
          var truncationSupported = isTextOnly || children.length == 1
              && children[0].tagName.toLowerCase() == 'p';
          if (truncationSupported) {
              var element = isTextOnly
                  ? this.renderedElement
                  : children[0];
              utils.truncate(element, maxHeight, this._computedLineHeight);
              return true;
          }
          return false;
      };
      TextBlock.prototype.setText = function (value) {
          _super.prototype.setText.call(this, value);
          this._processedText = null;
      };
      TextBlock.prototype.getRenderedDomElementType = function () {
          return "div";
      };
      TextBlock.prototype.internalRender = function () {
          var _this = this;
          this._processedText = null;
          if (!utils.isNullOrEmpty(this.text)) {
              var hostConfig = this.hostConfig;
              var element = document.createElement(this.getRenderedDomElementType());
              element.classList.add(hostConfig.makeCssClassName("ac-textBlock"));
              element.style.overflow = "hidden";
              this.applyStylesTo(element);
              if (this.selectAction) {
                  element.onclick = function (e) {
                      e.preventDefault();
                      e.cancelBubble = true;
                      _this.selectAction.execute();
                  };
                  if (hostConfig.supportsInteractivity) {
                      element.tabIndex = 0;
                      element.setAttribute("role", "button");
                      element.setAttribute("aria-label", this.selectAction.title);
                      element.classList.add(hostConfig.makeCssClassName("ac-selectable"));
                  }
              }
              if (!this._processedText) {
                  this._treatAsPlainText = true;
                  var formattedText = textFormatters.formatText(this.lang, this.text);
                  if (this.useMarkdown) {
                      if (AdaptiveCard.allowMarkForTextHighlighting) {
                          formattedText = formattedText.replace(/<mark>/g, "===").replace(/<\/mark>/g, "/==");
                      }
                      var markdownProcessingResult = AdaptiveCard.applyMarkdown(formattedText);
                      if (markdownProcessingResult.didProcess && markdownProcessingResult.outputHtml) {
                          this._processedText = markdownProcessingResult.outputHtml;
                          this._treatAsPlainText = false;
                          // Only process <mark> tag if markdown processing was applied because
                          // markdown processing is also responsible for sanitizing the input string
                          if (AdaptiveCard.allowMarkForTextHighlighting) {
                              var markStyle = "";
                              var effectiveStyle = this.getEffectiveStyleDefinition();
                              if (effectiveStyle.highlightBackgroundColor) {
                                  markStyle += "background-color: " + effectiveStyle.highlightBackgroundColor + ";";
                              }
                              if (effectiveStyle.highlightForegroundColor) {
                                  markStyle += "color: " + effectiveStyle.highlightForegroundColor + ";";
                              }
                              if (!utils.isNullOrEmpty(markStyle)) {
                                  markStyle = 'style="' + markStyle + '"';
                              }
                              this._processedText = this._processedText.replace(/===/g, "<mark " + markStyle + ">").replace(/\/==/g, "</mark>");
                          }
                      }
                      else {
                          this._processedText = formattedText;
                          this._treatAsPlainText = true;
                      }
                  }
                  else {
                      this._processedText = formattedText;
                      this._treatAsPlainText = true;
                  }
              }
              if (this._treatAsPlainText) {
                  element.innerText = this._processedText;
              }
              else {
                  element.innerHTML = this._processedText;
              }
              if (element.firstElementChild instanceof HTMLElement) {
                  var firstElementChild = element.firstElementChild;
                  firstElementChild.style.marginTop = "0px";
                  firstElementChild.style.width = "100%";
                  if (!this.wrap) {
                      firstElementChild.style.overflow = "hidden";
                      firstElementChild.style.textOverflow = "ellipsis";
                  }
              }
              if (element.lastElementChild instanceof HTMLElement) {
                  element.lastElementChild.style.marginBottom = "0px";
              }
              var anchors = element.getElementsByTagName("a");
              for (var i = 0; i < anchors.length; i++) {
                  var anchor = anchors[i];
                  anchor.classList.add(hostConfig.makeCssClassName("ac-anchor"));
                  anchor.target = "_blank";
                  anchor.onclick = function (e) {
                      if (raiseAnchorClickedEvent(_this, e.target)) {
                          e.preventDefault();
                          e.cancelBubble = true;
                      }
                  };
              }
              if (this.wrap) {
                  element.style.wordWrap = "break-word";
                  if (this.maxLines > 0) {
                      element.style.maxHeight = (this._computedLineHeight * this.maxLines) + "px";
                      element.style.overflow = "hidden";
                  }
              }
              else {
                  element.style.whiteSpace = "nowrap";
                  element.style.textOverflow = "ellipsis";
              }
              if (AdaptiveCard.useAdvancedTextBlockTruncation || AdaptiveCard.useAdvancedCardBottomTruncation) {
                  this._originalInnerHtml = element.innerHTML;
              }
              return element;
          }
          else {
              return null;
          }
      };
      TextBlock.prototype.truncateOverflow = function (maxHeight) {
          if (maxHeight >= this._computedLineHeight) {
              return this.truncateIfSupported(maxHeight);
          }
          return false;
      };
      TextBlock.prototype.undoOverflowTruncation = function () {
          this.restoreOriginalContent();
          if (AdaptiveCard.useAdvancedTextBlockTruncation && this.maxLines) {
              var maxHeight = this._computedLineHeight * this.maxLines;
              this.truncateIfSupported(maxHeight);
          }
      };
      TextBlock.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "wrap", this.wrap, false);
          utils.setProperty(result, "maxLines", this.maxLines, 0);
          return result;
      };
      TextBlock.prototype.applyStylesTo = function (targetElement) {
          _super.prototype.applyStylesTo.call(this, targetElement);
          var parentContainer = this.getParentContainer();
          var isRtl = parentContainer ? parentContainer.isRtl() : false;
          switch (this.horizontalAlignment) {
              case enums.HorizontalAlignment.Center:
                  targetElement.style.textAlign = "center";
                  break;
              case enums.HorizontalAlignment.Right:
                  targetElement.style.textAlign = isRtl ? "left" : "right";
                  break;
              default:
                  targetElement.style.textAlign = isRtl ? "right" : "left";
                  break;
          }
          var lineHeights = this.hostConfig.lineHeights;
          if (lineHeights) {
              switch (this.size) {
                  case enums.TextSize.Small:
                      this._computedLineHeight = lineHeights.small;
                      break;
                  case enums.TextSize.Medium:
                      this._computedLineHeight = lineHeights.medium;
                      break;
                  case enums.TextSize.Large:
                      this._computedLineHeight = lineHeights.large;
                      break;
                  case enums.TextSize.ExtraLarge:
                      this._computedLineHeight = lineHeights.extraLarge;
                      break;
                  default:
                      this._computedLineHeight = lineHeights.default;
                      break;
              }
          }
          else {
              // Looks like 1.33 is the magic number to compute line-height
              // from font size.
              this._computedLineHeight = this.getFontSize(this.hostConfig.getFontTypeDefinition(this.fontType)) * 1.33;
          }
          targetElement.style.lineHeight = this._computedLineHeight + "px";
      };
      TextBlock.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.wrap = utils.getBoolValue(json["wrap"], this.wrap);
          if (typeof json["maxLines"] === "number") {
              this.maxLines = json["maxLines"];
          }
      };
      TextBlock.prototype.getJsonTypeName = function () {
          return "TextBlock";
      };
      TextBlock.prototype.updateLayout = function (processChildren) {
          if (processChildren === void 0) { processChildren = false; }
          _super.prototype.updateLayout.call(this, processChildren);
          if (AdaptiveCard.useAdvancedTextBlockTruncation && this.maxLines && this.isRendered()) {
              // Reset the element's innerHTML in case the available room for
              // content has increased
              this.restoreOriginalContent();
              this.truncateIfSupported(this._computedLineHeight * this.maxLines);
          }
      };
      return TextBlock;
  }(BaseTextBlock));
  exports.TextBlock = TextBlock;
  var Label = /** @class */ (function (_super) {
      __extends(Label, _super);
      function Label() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Label.prototype.getRenderedDomElementType = function () {
          return "label";
      };
      Label.prototype.internalRender = function () {
          var renderedElement = _super.prototype.internalRender.call(this);
          if (!utils.isNullOrEmpty(this.forElementId)) {
              renderedElement.htmlFor = this.forElementId;
          }
          return renderedElement;
      };
      return Label;
  }(TextBlock));
  var TextRun = /** @class */ (function (_super) {
      __extends(TextRun, _super);
      function TextRun() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.italic = false;
          _this.strikethrough = false;
          _this.highlight = false;
          return _this;
      }
      TextRun.prototype.internalRender = function () {
          var _this = this;
          if (!utils.isNullOrEmpty(this.text)) {
              var hostConfig = this.hostConfig;
              var formattedText = textFormatters.formatText(this.lang, this.text);
              var element = document.createElement("span");
              element.classList.add(hostConfig.makeCssClassName("ac-textRun"));
              this.applyStylesTo(element);
              if (this.selectAction && hostConfig.supportsInteractivity) {
                  var anchor = document.createElement("a");
                  anchor.classList.add(hostConfig.makeCssClassName("ac-anchor"));
                  anchor.href = this.selectAction.getHref();
                  anchor.target = "_blank";
                  anchor.onclick = function (e) {
                      e.preventDefault();
                      e.cancelBubble = true;
                      _this.selectAction.execute();
                  };
                  anchor.innerText = formattedText;
                  element.appendChild(anchor);
              }
              else {
                  element.innerText = formattedText;
              }
              return element;
          }
          else {
              return null;
          }
      };
      TextRun.prototype.applyStylesTo = function (targetElement) {
          _super.prototype.applyStylesTo.call(this, targetElement);
          if (this.italic) {
              targetElement.style.fontStyle = "italic";
          }
          if (this.strikethrough) {
              targetElement.style.textDecoration = "line-through";
          }
          if (this.highlight) {
              var colorDefinition = this.getColorDefinition(this.getEffectiveStyleDefinition().foregroundColors, this.effectiveColor);
              targetElement.style.backgroundColor = utils.stringToCssColor(this.isSubtle ? colorDefinition.highlightColors.subtle : colorDefinition.highlightColors.default);
          }
      };
      TextRun.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "italic", this.italic, false);
          utils.setProperty(result, "strikethrough", this.strikethrough, false);
          utils.setProperty(result, "highlight", this.highlight, false);
          if (this.selectAction) {
              utils.setProperty(result, "selectAction", this.selectAction.toJSON());
          }
          return result;
      };
      TextRun.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.italic = utils.getBoolValue(json["italic"], this.italic);
          this.strikethrough = utils.getBoolValue(json["strikethrough"], this.strikethrough);
          this.highlight = utils.getBoolValue(json["highlight"], this.highlight);
          this.selectAction = createActionInstance(this, json["selectAction"], [ShowCardAction.JsonTypeName], !this.isDesignMode(), errors);
      };
      TextRun.prototype.getJsonTypeName = function () {
          return "TextRun";
      };
      Object.defineProperty(TextRun.prototype, "isStandalone", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(TextRun.prototype, "isInline", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      return TextRun;
  }(BaseTextBlock));
  exports.TextRun = TextRun;
  var RichTextBlock = /** @class */ (function (_super) {
      __extends(RichTextBlock, _super);
      function RichTextBlock() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._inlines = [];
          return _this;
      }
      RichTextBlock.prototype.internalAddInline = function (inline, forceAdd) {
          if (forceAdd === void 0) { forceAdd = false; }
          if (!inline.isInline) {
              throw new Error("RichTextBlock.addInline: the specified card element cannot be used as a RichTextBlock inline.");
          }
          var doAdd = inline.parent == null || forceAdd;
          if (!doAdd && inline.parent != this) {
              throw new Error("RichTextBlock.addInline: the specified inline already belongs to another RichTextBlock.");
          }
          else {
              inline.setParent(this);
              this._inlines.push(inline);
          }
      };
      RichTextBlock.prototype.internalRender = function () {
          if (this._inlines.length > 0) {
              var element = document.createElement("div");
              element.className = this.hostConfig.makeCssClassName("ac-richTextBlock");
              var parentContainer = this.getParentContainer();
              var isRtl = parentContainer ? parentContainer.isRtl() : false;
              switch (this.horizontalAlignment) {
                  case enums.HorizontalAlignment.Center:
                      element.style.textAlign = "center";
                      break;
                  case enums.HorizontalAlignment.Right:
                      element.style.textAlign = isRtl ? "left" : "right";
                      break;
                  default:
                      element.style.textAlign = isRtl ? "right" : "left";
                      break;
              }
              for (var _i = 0, _a = this._inlines; _i < _a.length; _i++) {
                  var inline = _a[_i];
                  element.appendChild(inline.render());
              }
              return element;
          }
          else {
              return null;
          }
      };
      RichTextBlock.prototype.asString = function () {
          var result = "";
          for (var _i = 0, _a = this._inlines; _i < _a.length; _i++) {
              var inline = _a[_i];
              result += inline.asString();
          }
          return result;
      };
      RichTextBlock.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this._inlines = [];
          if (Array.isArray(json["inlines"])) {
              for (var _i = 0, _a = json["inlines"]; _i < _a.length; _i++) {
                  var jsonInline = _a[_i];
                  var inline = void 0;
                  if (typeof jsonInline === "string") {
                      var textRun = new TextRun();
                      textRun.text = jsonInline;
                      inline = textRun;
                  }
                  else {
                      inline = createElementInstance(this, jsonInline, false, // No fallback for inlines in 1.2
                      errors);
                  }
                  if (inline) {
                      this.internalAddInline(inline, true);
                  }
              }
          }
      };
      RichTextBlock.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          if (this._inlines.length > 0) {
              var jsonInlines = [];
              for (var _i = 0, _a = this._inlines; _i < _a.length; _i++) {
                  var inline = _a[_i];
                  jsonInlines.push(inline.toJSON());
              }
              utils.setProperty(result, "inlines", jsonInlines);
          }
          return result;
      };
      RichTextBlock.prototype.getJsonTypeName = function () {
          return "RichTextBlock";
      };
      RichTextBlock.prototype.getInlineCount = function () {
          return this._inlines.length;
      };
      RichTextBlock.prototype.getInlineAt = function (index) {
          if (index >= 0 && index < this._inlines.length) {
              return this._inlines[index];
          }
          else {
              throw new Error("RichTextBlock.getInlineAt: Index out of range (" + index + ")");
          }
      };
      RichTextBlock.prototype.addInline = function (inline) {
          this.internalAddInline(inline);
      };
      RichTextBlock.prototype.removeInline = function (inline) {
          var index = this._inlines.indexOf(inline);
          if (index >= 0) {
              this._inlines[index].setParent(null);
              this._inlines.splice(index, 1);
              return true;
          }
          return false;
      };
      return RichTextBlock;
  }(CardElement));
  exports.RichTextBlock = RichTextBlock;
  var Fact = /** @class */ (function () {
      function Fact(name, value) {
          if (name === void 0) { name = undefined; }
          if (value === void 0) { value = undefined; }
          this.name = name;
          this.value = value;
      }
      Fact.prototype.parse = function (json) {
          this.name = utils.getStringValue(json["title"]);
          this.value = utils.getStringValue(json["value"]);
      };
      Fact.prototype.toJSON = function () {
          return { title: this.name, value: this.value };
      };
      return Fact;
  }());
  exports.Fact = Fact;
  var FactSet = /** @class */ (function (_super) {
      __extends(FactSet, _super);
      function FactSet() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.facts = [];
          return _this;
      }
      Object.defineProperty(FactSet.prototype, "useDefaultSizing", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      FactSet.prototype.internalRender = function () {
          var element = null;
          var hostConfig = this.hostConfig;
          if (this.facts.length > 0) {
              element = document.createElement("table");
              element.style.borderWidth = "0px";
              element.style.borderSpacing = "0px";
              element.style.borderStyle = "none";
              element.style.borderCollapse = "collapse";
              element.style.display = "block";
              element.style.overflow = "hidden";
              element.classList.add(hostConfig.makeCssClassName("ac-factset"));
              for (var i = 0; i < this.facts.length; i++) {
                  var trElement = document.createElement("tr");
                  if (i > 0) {
                      trElement.style.marginTop = hostConfig.factSet.spacing + "px";
                  }
                  // Title column
                  var tdElement = document.createElement("td");
                  tdElement.style.padding = "0";
                  tdElement.classList.add(hostConfig.makeCssClassName("ac-fact-title"));
                  if (hostConfig.factSet.title.maxWidth) {
                      tdElement.style.maxWidth = hostConfig.factSet.title.maxWidth + "px";
                  }
                  tdElement.style.verticalAlign = "top";
                  var textBlock = new TextBlock();
                  textBlock.setParent(this);
                  textBlock.text = utils.isNullOrEmpty(this.facts[i].name) ? "Title" : this.facts[i].name;
                  textBlock.size = hostConfig.factSet.title.size;
                  textBlock.color = hostConfig.factSet.title.color;
                  textBlock.isSubtle = hostConfig.factSet.title.isSubtle;
                  textBlock.weight = hostConfig.factSet.title.weight;
                  textBlock.wrap = hostConfig.factSet.title.wrap;
                  textBlock.spacing = enums.Spacing.None;
                  utils.appendChild(tdElement, textBlock.render());
                  utils.appendChild(trElement, tdElement);
                  // Spacer column
                  tdElement = document.createElement("td");
                  tdElement.style.width = "10px";
                  utils.appendChild(trElement, tdElement);
                  // Value column
                  tdElement = document.createElement("td");
                  tdElement.style.padding = "0";
                  tdElement.style.verticalAlign = "top";
                  tdElement.classList.add(hostConfig.makeCssClassName("ac-fact-value"));
                  textBlock = new TextBlock();
                  textBlock.setParent(this);
                  textBlock.text = this.facts[i].value;
                  textBlock.size = hostConfig.factSet.value.size;
                  textBlock.color = hostConfig.factSet.value.color;
                  textBlock.isSubtle = hostConfig.factSet.value.isSubtle;
                  textBlock.weight = hostConfig.factSet.value.weight;
                  textBlock.wrap = hostConfig.factSet.value.wrap;
                  textBlock.spacing = enums.Spacing.None;
                  utils.appendChild(tdElement, textBlock.render());
                  utils.appendChild(trElement, tdElement);
                  utils.appendChild(element, trElement);
              }
          }
          return element;
      };
      FactSet.prototype.getJsonTypeName = function () {
          return "FactSet";
      };
      FactSet.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          var facts = [];
          for (var _i = 0, _a = this.facts; _i < _a.length; _i++) {
              var fact = _a[_i];
              facts.push(fact.toJSON());
          }
          utils.setProperty(result, "facts", facts);
          return result;
      };
      FactSet.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.facts = [];
          if (json["facts"] != null) {
              var jsonFacts = json["facts"];
              this.facts = [];
              for (var i = 0; i < jsonFacts.length; i++) {
                  var fact = new Fact();
                  fact.parse(jsonFacts[i]);
                  this.facts.push(fact);
              }
          }
      };
      return FactSet;
  }(CardElement));
  exports.FactSet = FactSet;
  var Image = /** @class */ (function (_super) {
      __extends(Image, _super);
      function Image() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.style = enums.ImageStyle.Default;
          _this.size = enums.Size.Auto;
          _this.pixelWidth = null;
          _this.pixelHeight = null;
          _this.altText = "";
          return _this;
      }
      Image.prototype.parseDimension = function (name, value, errors) {
          if (value) {
              if (typeof value === "string") {
                  try {
                      var size = shared.SizeAndUnit.parse(value);
                      if (size.unit == enums.SizeUnit.Pixel) {
                          return size.physicalSize;
                      }
                  }
                  catch (_a) {
                      // Ignore error
                  }
              }
              raiseParseError({
                  error: enums.ValidationError.InvalidPropertyValue,
                  message: "Invalid image " + name + ": " + value
              }, errors);
          }
          return 0;
      };
      Image.prototype.applySize = function (element) {
          if (this.pixelWidth || this.pixelHeight) {
              if (this.pixelWidth) {
                  element.style.width = this.pixelWidth + "px";
              }
              if (this.pixelHeight) {
                  element.style.height = this.pixelHeight + "px";
              }
          }
          else {
              switch (this.size) {
                  case enums.Size.Stretch:
                      element.style.width = "100%";
                      break;
                  case enums.Size.Auto:
                      element.style.maxWidth = "100%";
                      break;
                  case enums.Size.Small:
                      element.style.width = this.hostConfig.imageSizes.small + "px";
                      break;
                  case enums.Size.Large:
                      element.style.width = this.hostConfig.imageSizes.large + "px";
                      break;
                  case enums.Size.Medium:
                      element.style.width = this.hostConfig.imageSizes.medium + "px";
                      break;
              }
          }
      };
      Object.defineProperty(Image.prototype, "useDefaultSizing", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      Image.prototype.internalRender = function () {
          var _this = this;
          var element = null;
          if (!utils.isNullOrEmpty(this.url)) {
              element = document.createElement("div");
              element.style.display = "flex";
              element.style.alignItems = "flex-start";
              element.onkeypress = function (e) {
                  if (_this.selectAction && (e.keyCode == 13 || e.keyCode == 32)) { // enter or space pressed
                      e.preventDefault();
                      e.cancelBubble = true;
                      _this.selectAction.execute();
                  }
              };
              element.onclick = function (e) {
                  if (_this.selectAction) {
                      e.preventDefault();
                      e.cancelBubble = true;
                      _this.selectAction.execute();
                  }
              };
              switch (this.horizontalAlignment) {
                  case enums.HorizontalAlignment.Center:
                      element.style.justifyContent = "center";
                      break;
                  case enums.HorizontalAlignment.Right:
                      element.style.justifyContent = "flex-end";
                      break;
                  default:
                      element.style.justifyContent = "flex-start";
                      break;
              }
              // Cache hostConfig to avoid walking the parent hierarchy multiple times
              var hostConfig = this.hostConfig;
              var imageElement = document.createElement("img");
              imageElement.onload = function (e) {
                  raiseImageLoadedEvent(_this);
              };
              imageElement.onerror = function (e) {
                  var card = _this.getRootElement();
                  _this.renderedElement.innerHTML = "";
                  if (card && card.designMode) {
                      var errorElement = document.createElement("div");
                      errorElement.style.display = "flex";
                      errorElement.style.alignItems = "center";
                      errorElement.style.justifyContent = "center";
                      errorElement.style.backgroundColor = "#EEEEEE";
                      errorElement.style.color = "black";
                      errorElement.innerText = ":-(";
                      errorElement.style.padding = "10px";
                      _this.applySize(errorElement);
                      _this.renderedElement.appendChild(errorElement);
                  }
                  raiseImageLoadedEvent(_this);
              };
              imageElement.style.maxHeight = "100%";
              imageElement.style.minWidth = "0";
              imageElement.classList.add(hostConfig.makeCssClassName("ac-image"));
              if (this.selectAction != null && hostConfig.supportsInteractivity) {
                  imageElement.tabIndex = 0;
                  imageElement.setAttribute("role", "button");
                  imageElement.setAttribute("aria-label", this.selectAction.title);
                  imageElement.classList.add(hostConfig.makeCssClassName("ac-selectable"));
              }
              this.applySize(imageElement);
              if (this.style === enums.ImageStyle.Person) {
                  imageElement.style.borderRadius = "50%";
                  imageElement.style.backgroundPosition = "50% 50%";
                  imageElement.style.backgroundRepeat = "no-repeat";
              }
              if (!utils.isNullOrEmpty(this.backgroundColor)) {
                  imageElement.style.backgroundColor = utils.stringToCssColor(this.backgroundColor);
              }
              imageElement.src = this.url;
              imageElement.alt = this.altText;
              element.appendChild(imageElement);
          }
          return element;
      };
      Image.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          if (this._selectAction) {
              utils.setProperty(result, "selectAction", this._selectAction.toJSON());
          }
          utils.setEnumProperty(enums.ImageStyle, result, "style", this.style, enums.ImageStyle.Default);
          utils.setProperty(result, "backgroundColor", this.backgroundColor);
          utils.setProperty(result, "url", this.url);
          utils.setEnumProperty(enums.Size, result, "size", this.size, enums.Size.Auto);
          if (this.pixelWidth) {
              utils.setProperty(result, "width", this.pixelWidth + "px");
          }
          if (this.pixelHeight) {
              utils.setProperty(result, "height", this.pixelHeight + "px");
          }
          utils.setProperty(result, "altText", this.altText);
          return result;
      };
      Image.prototype.getJsonTypeName = function () {
          return "Image";
      };
      Image.prototype.getActionById = function (id) {
          var result = _super.prototype.getActionById.call(this, id);
          if (!result && this.selectAction) {
              result = this.selectAction.getActionById(id);
          }
          return result;
      };
      Image.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.url = utils.getStringValue(json["url"]);
          this.backgroundColor = utils.getStringValue(json["backgroundColor"]);
          var styleString = utils.getStringValue(json["style"]);
          if (styleString && styleString.toLowerCase() === "normal") {
              this.style = enums.ImageStyle.Default;
              raiseParseError({
                  error: enums.ValidationError.Deprecated,
                  message: "The Image.style value \"normal\" is deprecated and will be removed. Use \"default\" instead."
              }, errors);
          }
          else {
              this.style = utils.getEnumValue(enums.ImageStyle, styleString, this.style);
          }
          this.size = utils.getEnumValue(enums.Size, json["size"], this.size);
          this.altText = json["altText"];
          // pixelWidth and pixelHeight are only parsed for backwards compatibility.
          // Payloads should use the width and height proerties instead.
          if (json["pixelWidth"] && typeof json["pixelWidth"] === "number") {
              this.pixelWidth = json["pixelWidth"];
              raiseParseError({
                  error: enums.ValidationError.Deprecated,
                  message: "The pixelWidth property is deprecated and will be removed. Use the width property instead."
              }, errors);
          }
          if (json["pixelHeight"] && typeof json["pixelHeight"] === "number") {
              this.pixelHeight = json["pixelHeight"];
              raiseParseError({
                  error: enums.ValidationError.Deprecated,
                  message: "The pixelHeight property is deprecated and will be removed. Use the height property instead."
              }, errors);
          }
          var size = this.parseDimension("width", json["width"], errors);
          if (size > 0) {
              this.pixelWidth = size;
          }
          size = this.parseDimension("height", json["height"], errors);
          if (size > 0) {
              this.pixelHeight = size;
          }
          this.selectAction = createActionInstance(this, json["selectAction"], [ShowCardAction.JsonTypeName], !this.isDesignMode(), errors);
      };
      Image.prototype.getResourceInformation = function () {
          if (!utils.isNullOrEmpty(this.url)) {
              return [{ url: this.url, mimeType: "image" }];
          }
          else {
              return [];
          }
      };
      Object.defineProperty(Image.prototype, "selectAction", {
          get: function () {
              return this._selectAction;
          },
          set: function (value) {
              this._selectAction = value;
              if (this._selectAction) {
                  this._selectAction.setParent(this);
              }
          },
          enumerable: true,
          configurable: true
      });
      return Image;
  }(CardElement));
  exports.Image = Image;
  var CardElementContainer = /** @class */ (function (_super) {
      __extends(CardElementContainer, _super);
      function CardElementContainer() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._selectAction = null;
          return _this;
      }
      CardElementContainer.prototype.isElementAllowed = function (element, forbiddenElementTypes) {
          if (!this.hostConfig.supportsInteractivity && element.isInteractive) {
              return false;
          }
          if (forbiddenElementTypes) {
              for (var _i = 0, forbiddenElementTypes_1 = forbiddenElementTypes; _i < forbiddenElementTypes_1.length; _i++) {
                  var forbiddenElementType = forbiddenElementTypes_1[_i];
                  if (element.getJsonTypeName() === forbiddenElementType) {
                      return false;
                  }
              }
          }
          return true;
      };
      CardElementContainer.prototype.applyPadding = function () {
          _super.prototype.applyPadding.call(this);
          if (!this.renderedElement) {
              return;
          }
          var physicalPadding = new shared.SpacingDefinition();
          if (this.getEffectivePadding()) {
              physicalPadding = this.hostConfig.paddingDefinitionToSpacingDefinition(this.getEffectivePadding());
          }
          this.renderedElement.style.paddingTop = physicalPadding.top + "px";
          this.renderedElement.style.paddingRight = physicalPadding.right + "px";
          this.renderedElement.style.paddingBottom = physicalPadding.bottom + "px";
          this.renderedElement.style.paddingLeft = physicalPadding.left + "px";
          this.renderedElement.style.marginRight = "0";
          this.renderedElement.style.marginLeft = "0";
      };
      CardElementContainer.prototype.getSelectAction = function () {
          return this._selectAction;
      };
      CardElementContainer.prototype.setSelectAction = function (value) {
          this._selectAction = value;
          if (this._selectAction) {
              this._selectAction.setParent(this);
          }
      };
      Object.defineProperty(CardElementContainer.prototype, "isSelectable", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      CardElementContainer.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          if (this.isSelectable) {
              this._selectAction = createActionInstance(this, json["selectAction"], [ShowCardAction.JsonTypeName], !this.isDesignMode(), errors);
          }
      };
      CardElementContainer.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          if (this._selectAction && this.isSelectable) {
              utils.setProperty(result, "selectAction", this._selectAction.toJSON());
          }
          return result;
      };
      CardElementContainer.prototype.internalValidateProperties = function (context) {
          _super.prototype.internalValidateProperties.call(this, context);
          for (var i = 0; i < this.getItemCount(); i++) {
              var item = this.getItemAt(i);
              if (!this.hostConfig.supportsInteractivity && item.isInteractive) {
                  context.addFailure(this, {
                      error: enums.ValidationError.InteractivityNotAllowed,
                      message: "Interactivity is not allowed."
                  });
              }
              if (!this.isElementAllowed(item, this.getForbiddenElementTypes())) {
                  context.addFailure(this, {
                      error: enums.ValidationError.InteractivityNotAllowed,
                      message: "Elements of type " + item.getJsonTypeName() + " are not allowed in this container."
                  });
              }
              item.internalValidateProperties(context);
          }
          if (this._selectAction) {
              this._selectAction.internalValidateProperties(context);
          }
      };
      CardElementContainer.prototype.render = function () {
          var _this = this;
          var element = _super.prototype.render.call(this);
          var hostConfig = this.hostConfig;
          if (this.isSelectable && this._selectAction && hostConfig.supportsInteractivity) {
              element.classList.add(hostConfig.makeCssClassName("ac-selectable"));
              element.tabIndex = 0;
              element.setAttribute("role", "button");
              element.setAttribute("aria-label", this._selectAction.title);
              element.onclick = function (e) {
                  if (_this._selectAction != null) {
                      e.preventDefault();
                      e.cancelBubble = true;
                      _this._selectAction.execute();
                  }
              };
              element.onkeypress = function (e) {
                  if (_this._selectAction != null && (e.keyCode == 13 || e.keyCode == 32)) {
                      // Enter or space pressed
                      e.preventDefault();
                      e.cancelBubble = true;
                      _this._selectAction.execute();
                  }
              };
          }
          return element;
      };
      CardElementContainer.prototype.updateLayout = function (processChildren) {
          if (processChildren === void 0) { processChildren = true; }
          _super.prototype.updateLayout.call(this, processChildren);
          if (processChildren) {
              for (var i = 0; i < this.getItemCount(); i++) {
                  this.getItemAt(i).updateLayout();
              }
          }
      };
      CardElementContainer.prototype.getAllInputs = function () {
          var result = [];
          for (var i = 0; i < this.getItemCount(); i++) {
              result = result.concat(this.getItemAt(i).getAllInputs());
          }
          return result;
      };
      CardElementContainer.prototype.getResourceInformation = function () {
          var result = [];
          for (var i = 0; i < this.getItemCount(); i++) {
              result = result.concat(this.getItemAt(i).getResourceInformation());
          }
          return result;
      };
      CardElementContainer.prototype.getElementById = function (id) {
          var result = _super.prototype.getElementById.call(this, id);
          if (!result) {
              for (var i = 0; i < this.getItemCount(); i++) {
                  result = this.getItemAt(i).getElementById(id);
                  if (result) {
                      break;
                  }
              }
          }
          return result;
      };
      return CardElementContainer;
  }(CardElement));
  exports.CardElementContainer = CardElementContainer;
  var ImageSet = /** @class */ (function (_super) {
      __extends(ImageSet, _super);
      function ImageSet() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._images = [];
          _this.imageSize = enums.Size.Medium;
          return _this;
      }
      ImageSet.prototype.internalRender = function () {
          var element = null;
          if (this._images.length > 0) {
              element = document.createElement("div");
              element.style.display = "flex";
              element.style.flexWrap = "wrap";
              for (var i = 0; i < this._images.length; i++) {
                  this._images[i].size = this.imageSize;
                  var renderedImage = this._images[i].render();
                  renderedImage.style.display = "inline-flex";
                  renderedImage.style.margin = "0px";
                  renderedImage.style.marginRight = "10px";
                  renderedImage.style.maxHeight = this.hostConfig.imageSet.maxImageHeight + "px";
                  utils.appendChild(element, renderedImage);
              }
          }
          return element;
      };
      ImageSet.prototype.getItemCount = function () {
          return this._images.length;
      };
      ImageSet.prototype.getItemAt = function (index) {
          return this._images[index];
      };
      ImageSet.prototype.getFirstVisibleRenderedItem = function () {
          return this._images && this._images.length > 0 ? this._images[0] : null;
      };
      ImageSet.prototype.getLastVisibleRenderedItem = function () {
          return this._images && this._images.length > 0 ? this._images[this._images.length - 1] : null;
      };
      ImageSet.prototype.removeItem = function (item) {
          if (item instanceof Image) {
              var itemIndex = this._images.indexOf(item);
              if (itemIndex >= 0) {
                  this._images.splice(itemIndex, 1);
                  item.setParent(null);
                  this.updateLayout();
                  return true;
              }
          }
          return false;
      };
      ImageSet.prototype.getJsonTypeName = function () {
          return "ImageSet";
      };
      ImageSet.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setEnumProperty(enums.Size, result, "imageSize", this.imageSize, enums.Size.Medium);
          if (this._images.length > 0) {
              var images = [];
              for (var _i = 0, _a = this._images; _i < _a.length; _i++) {
                  var image = _a[_i];
                  images.push(image.toJSON());
              }
              utils.setProperty(result, "images", images);
          }
          return result;
      };
      ImageSet.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.imageSize = utils.getEnumValue(enums.Size, json["imageSize"], enums.Size.Medium);
          if (json["images"] != null) {
              var jsonImages = json["images"];
              this._images = [];
              for (var i = 0; i < jsonImages.length; i++) {
                  var image = new Image();
                  image.parse(jsonImages[i], errors);
                  this.addImage(image);
              }
          }
      };
      ImageSet.prototype.addImage = function (image) {
          if (!image.parent) {
              this._images.push(image);
              image.setParent(this);
          }
          else {
              throw new Error("This image already belongs to another ImageSet");
          }
      };
      ImageSet.prototype.indexOf = function (cardElement) {
          return cardElement instanceof Image ? this._images.indexOf(cardElement) : -1;
      };
      return ImageSet;
  }(CardElementContainer));
  exports.ImageSet = ImageSet;
  var MediaSource = /** @class */ (function () {
      function MediaSource(url, mimeType) {
          if (url === void 0) { url = undefined; }
          if (mimeType === void 0) { mimeType = undefined; }
          this.url = url;
          this.mimeType = mimeType;
      }
      MediaSource.prototype.parse = function (json, errors) {
          this.mimeType = utils.getStringValue(json["mimeType"]);
          this.url = utils.getStringValue(json["url"]);
      };
      MediaSource.prototype.toJSON = function () {
          return {
              mimeType: this.mimeType,
              url: this.url
          };
      };
      return MediaSource;
  }());
  exports.MediaSource = MediaSource;
  var Media = /** @class */ (function (_super) {
      __extends(Media, _super);
      function Media() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.sources = [];
          return _this;
      }
      Media.prototype.getPosterUrl = function () {
          return this.poster ? this.poster : this.hostConfig.media.defaultPoster;
      };
      Media.prototype.processSources = function () {
          this._selectedSources = [];
          this._selectedMediaType = undefined;
          for (var _i = 0, _a = this.sources; _i < _a.length; _i++) {
              var source = _a[_i];
              var mimeComponents = source.mimeType.split('/');
              if (mimeComponents.length == 2) {
                  if (!this._selectedMediaType) {
                      var index = Media.supportedMediaTypes.indexOf(mimeComponents[0]);
                      if (index >= 0) {
                          this._selectedMediaType = Media.supportedMediaTypes[index];
                      }
                  }
                  if (mimeComponents[0] == this._selectedMediaType) {
                      this._selectedSources.push(source);
                  }
              }
          }
      };
      Media.prototype.renderPoster = function () {
          var _this = this;
          var playButtonArrowWidth = 12;
          var playButtonArrowHeight = 15;
          var posterRootElement = document.createElement("div");
          posterRootElement.className = this.hostConfig.makeCssClassName("ac-media-poster");
          posterRootElement.setAttribute("role", "contentinfo");
          posterRootElement.setAttribute("aria-label", this.altText ? this.altText : "Media content");
          posterRootElement.style.position = "relative";
          posterRootElement.style.display = "flex";
          var posterUrl = this.getPosterUrl();
          if (posterUrl) {
              var posterImageElement_1 = document.createElement("img");
              posterImageElement_1.style.width = "100%";
              posterImageElement_1.style.height = "100%";
              posterImageElement_1.onerror = function (e) {
                  posterImageElement_1.parentNode.removeChild(posterImageElement_1);
                  posterRootElement.classList.add("empty");
                  posterRootElement.style.minHeight = "150px";
              };
              posterImageElement_1.src = posterUrl;
              posterRootElement.appendChild(posterImageElement_1);
          }
          else {
              posterRootElement.classList.add("empty");
              posterRootElement.style.minHeight = "150px";
          }
          if (this.hostConfig.supportsInteractivity && this._selectedSources.length > 0) {
              var playButtonOuterElement = document.createElement("div");
              playButtonOuterElement.setAttribute("role", "button");
              playButtonOuterElement.setAttribute("aria-label", "Play media");
              playButtonOuterElement.className = this.hostConfig.makeCssClassName("ac-media-playButton");
              playButtonOuterElement.style.display = "flex";
              playButtonOuterElement.style.alignItems = "center";
              playButtonOuterElement.style.justifyContent = "center";
              playButtonOuterElement.onclick = function (e) {
                  if (_this.hostConfig.media.allowInlinePlayback) {
                      e.preventDefault();
                      e.cancelBubble = true;
                      var mediaPlayerElement = _this.renderMediaPlayer();
                      _this.renderedElement.innerHTML = "";
                      _this.renderedElement.appendChild(mediaPlayerElement);
                      mediaPlayerElement.play();
                  }
                  else {
                      if (Media.onPlay) {
                          e.preventDefault();
                          e.cancelBubble = true;
                          Media.onPlay(_this);
                      }
                  }
              };
              var playButtonInnerElement = document.createElement("div");
              playButtonInnerElement.className = this.hostConfig.makeCssClassName("ac-media-playButton-arrow");
              playButtonInnerElement.style.width = playButtonArrowWidth + "px";
              playButtonInnerElement.style.height = playButtonArrowHeight + "px";
              playButtonInnerElement.style.borderTopWidth = (playButtonArrowHeight / 2) + "px";
              playButtonInnerElement.style.borderBottomWidth = (playButtonArrowHeight / 2) + "px";
              playButtonInnerElement.style.borderLeftWidth = playButtonArrowWidth + "px";
              playButtonInnerElement.style.borderRightWidth = "0";
              playButtonInnerElement.style.borderStyle = "solid";
              playButtonInnerElement.style.borderTopColor = "transparent";
              playButtonInnerElement.style.borderRightColor = "transparent";
              playButtonInnerElement.style.borderBottomColor = "transparent";
              playButtonInnerElement.style.transform = "translate(" + (playButtonArrowWidth / 10) + "px,0px)";
              playButtonOuterElement.appendChild(playButtonInnerElement);
              var playButtonContainer = document.createElement("div");
              playButtonContainer.style.position = "absolute";
              playButtonContainer.style.left = "0";
              playButtonContainer.style.top = "0";
              playButtonContainer.style.width = "100%";
              playButtonContainer.style.height = "100%";
              playButtonContainer.style.display = "flex";
              playButtonContainer.style.justifyContent = "center";
              playButtonContainer.style.alignItems = "center";
              playButtonContainer.appendChild(playButtonOuterElement);
              posterRootElement.appendChild(playButtonContainer);
          }
          return posterRootElement;
      };
      Media.prototype.renderMediaPlayer = function () {
          var mediaElement;
          if (this._selectedMediaType == "video") {
              var videoPlayer = document.createElement("video");
              var posterUrl = this.getPosterUrl();
              if (posterUrl) {
                  videoPlayer.poster = posterUrl;
              }
              mediaElement = videoPlayer;
          }
          else {
              mediaElement = document.createElement("audio");
          }
          mediaElement.controls = true;
          mediaElement.preload = "none";
          mediaElement.style.width = "100%";
          for (var _i = 0, _a = this.sources; _i < _a.length; _i++) {
              var source = _a[_i];
              var src = document.createElement("source");
              src.src = source.url;
              src.type = source.mimeType;
              mediaElement.appendChild(src);
          }
          return mediaElement;
      };
      Media.prototype.internalRender = function () {
          var element = document.createElement("div");
          element.className = this.hostConfig.makeCssClassName("ac-media");
          this.processSources();
          element.appendChild(this.renderPoster());
          return element;
      };
      Media.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.poster = utils.getStringValue(json["poster"]);
          this.altText = utils.getStringValue(json["altText"]);
          if (json["sources"] != null) {
              var jsonSources = json["sources"];
              this.sources = [];
              for (var i = 0; i < jsonSources.length; i++) {
                  var source = new MediaSource();
                  source.parse(jsonSources[i], errors);
                  this.sources.push(source);
              }
          }
      };
      Media.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "poster", this.poster);
          utils.setProperty(result, "altText", this.altText);
          if (this.sources.length > 0) {
              var serializedSources = [];
              for (var _i = 0, _a = this.sources; _i < _a.length; _i++) {
                  var source = _a[_i];
                  serializedSources.push(source.toJSON());
              }
              utils.setProperty(result, "sources", serializedSources);
          }
          return result;
      };
      Media.prototype.getJsonTypeName = function () {
          return "Media";
      };
      Media.prototype.getResourceInformation = function () {
          var result = [];
          var posterUrl = this.getPosterUrl();
          if (!utils.isNullOrEmpty(posterUrl)) {
              result.push({ url: posterUrl, mimeType: "image" });
          }
          for (var _i = 0, _a = this.sources; _i < _a.length; _i++) {
              var mediaSource = _a[_i];
              if (!utils.isNullOrEmpty(mediaSource.url)) {
                  result.push({ url: mediaSource.url, mimeType: mediaSource.mimeType });
              }
          }
          return result;
      };
      Object.defineProperty(Media.prototype, "selectedMediaType", {
          get: function () {
              return this._selectedMediaType;
          },
          enumerable: true,
          configurable: true
      });
      Media.supportedMediaTypes = ["audio", "video"];
      return Media;
  }(CardElement));
  exports.Media = Media;
  var InputValidationOptions = /** @class */ (function () {
      function InputValidationOptions() {
          this.necessity = enums.InputValidationNecessity.Optional;
          this.errorMessage = undefined;
      }
      InputValidationOptions.prototype.parse = function (json) {
          this.necessity = utils.getEnumValue(enums.InputValidationNecessity, json["necessity"], this.necessity);
          this.errorMessage = utils.getStringValue(json["errorMessage"]);
      };
      InputValidationOptions.prototype.toJSON = function () {
          if (this.necessity != enums.InputValidationNecessity.Optional || !utils.isNullOrEmpty(this.errorMessage)) {
              var result = {};
              utils.setEnumProperty(enums.InputValidationNecessity, result, "necessity", this.necessity, enums.InputValidationNecessity.Optional);
              utils.setProperty(result, "errorMessage", this.errorMessage);
              return result;
          }
          else {
              return null;
          }
      };
      return InputValidationOptions;
  }());
  exports.InputValidationOptions = InputValidationOptions;
  var Input = /** @class */ (function (_super) {
      __extends(Input, _super);
      function Input() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.validation = new InputValidationOptions();
          return _this;
      }
      Object.defineProperty(Input.prototype, "isNullable", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Input.prototype, "renderedInputControlElement", {
          get: function () {
              return this._renderedInputControlElement;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Input.prototype, "inputControlContainerElement", {
          get: function () {
              return this._inputControlContainerElement;
          },
          enumerable: true,
          configurable: true
      });
      Input.prototype.overrideInternalRender = function () {
          var hostConfig = this.hostConfig;
          this._outerContainerElement = document.createElement("div");
          this._outerContainerElement.style.display = "flex";
          this._outerContainerElement.style.flexDirection = "column";
          this._inputControlContainerElement = document.createElement("div");
          this._inputControlContainerElement.className = hostConfig.makeCssClassName("ac-input-container");
          this._inputControlContainerElement.style.display = "flex";
          this._renderedInputControlElement = this.internalRender();
          this._renderedInputControlElement.style.minWidth = "0px";
          if (this.isNullable && this.validation.necessity == enums.InputValidationNecessity.RequiredWithVisualCue) {
              this._renderedInputControlElement.classList.add(hostConfig.makeCssClassName("ac-input-required"));
          }
          this._inputControlContainerElement.appendChild(this._renderedInputControlElement);
          this._outerContainerElement.appendChild(this._inputControlContainerElement);
          return this._outerContainerElement;
      };
      Input.prototype.valueChanged = function () {
          this.resetValidationFailureCue();
          if (this.onValueChanged) {
              this.onValueChanged(this);
          }
          raiseInputValueChangedEvent(this);
      };
      Input.prototype.resetValidationFailureCue = function () {
          if (AdaptiveCard.useBuiltInInputValidation && this.renderedElement) {
              this._renderedInputControlElement.classList.remove(this.hostConfig.makeCssClassName("ac-input-validation-failed"));
              if (this._errorMessageElement) {
                  this._outerContainerElement.removeChild(this._errorMessageElement);
                  this._errorMessageElement = null;
              }
          }
      };
      Input.prototype.showValidationErrorMessage = function () {
          if (this.renderedElement && AdaptiveCard.useBuiltInInputValidation && AdaptiveCard.displayInputValidationErrors && !utils.isNullOrEmpty(this.validation.errorMessage)) {
              this._errorMessageElement = document.createElement("span");
              this._errorMessageElement.className = this.hostConfig.makeCssClassName("ac-input-validation-error-message");
              this._errorMessageElement.textContent = this.validation.errorMessage;
              this._outerContainerElement.appendChild(this._errorMessageElement);
          }
      };
      Input.prototype.parseInputValue = function (value) {
          return value;
      };
      Input.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "title", this.title);
          utils.setProperty(result, "value", this.renderedElement && !utils.isNullOrEmpty(this.value) ? this.value : this.defaultValue);
          utils.setProperty(result, "validation", this.validation.toJSON());
          return result;
      };
      Input.prototype.internalValidateProperties = function (context) {
          _super.prototype.internalValidateProperties.call(this, context);
          if (utils.isNullOrEmpty(this.id)) {
              context.addFailure(this, {
                  error: enums.ValidationError.PropertyCantBeNull,
                  message: "All inputs must have a unique Id"
              });
          }
      };
      Input.prototype.validateValue = function () {
          if (AdaptiveCard.useBuiltInInputValidation) {
              this.resetValidationFailureCue();
              var result = this.validation.necessity != enums.InputValidationNecessity.Optional ? !utils.isNullOrEmpty(this.value) : true;
              if (!result && this.renderedElement) {
                  this._renderedInputControlElement.classList.add(this.hostConfig.makeCssClassName("ac-input-validation-failed"));
                  this.showValidationErrorMessage();
              }
              return result;
          }
          else {
              return true;
          }
      };
      Input.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.id = utils.getStringValue(json["id"]);
          this.defaultValue = utils.getStringValue(json["value"]);
          var jsonValidation = json["validation"];
          if (jsonValidation) {
              this.validation.parse(jsonValidation);
          }
      };
      Input.prototype.getAllInputs = function () {
          return [this];
      };
      Object.defineProperty(Input.prototype, "defaultValue", {
          get: function () {
              return this._defaultValue;
          },
          set: function (value) {
              this._defaultValue = this.parseInputValue(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Input.prototype, "isInteractive", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      return Input;
  }(CardElement));
  exports.Input = Input;
  var TextInput = /** @class */ (function (_super) {
      __extends(TextInput, _super);
      function TextInput() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isMultiline = false;
          _this.style = enums.InputTextStyle.Text;
          return _this;
      }
      TextInput.prototype.internalRender = function () {
          var _this = this;
          if (this.isMultiline) {
              var textareaElement = document.createElement("textarea");
              textareaElement.className = this.hostConfig.makeCssClassName("ac-input", "ac-textInput", "ac-multiline");
              textareaElement.style.flex = "1 1 auto";
              textareaElement.tabIndex = 0;
              if (!utils.isNullOrEmpty(this.placeholder)) {
                  textareaElement.placeholder = this.placeholder;
                  textareaElement.setAttribute("aria-label", this.placeholder);
              }
              if (!utils.isNullOrEmpty(this.defaultValue)) {
                  textareaElement.value = this.defaultValue;
              }
              if (this.maxLength > 0) {
                  textareaElement.maxLength = this.maxLength;
              }
              textareaElement.oninput = function () { _this.valueChanged(); };
              textareaElement.onkeypress = function (e) {
                  // Ctrl+Enter pressed
                  if (e.keyCode == 10 && _this.inlineAction) {
                      _this.inlineAction.execute();
                  }
              };
              return textareaElement;
          }
          else {
              var inputElement = document.createElement("input");
              inputElement.type = enums.InputTextStyle[this.style].toLowerCase();
              inputElement.className = this.hostConfig.makeCssClassName("ac-input", "ac-textInput");
              inputElement.style.flex = "1 1 auto";
              inputElement.tabIndex = 0;
              if (!utils.isNullOrEmpty(this.placeholder)) {
                  inputElement.placeholder = this.placeholder;
                  inputElement.setAttribute("aria-label", this.placeholder);
              }
              if (!utils.isNullOrEmpty(this.defaultValue)) {
                  inputElement.value = this.defaultValue;
              }
              if (this.maxLength > 0) {
                  inputElement.maxLength = this.maxLength;
              }
              inputElement.oninput = function () { _this.valueChanged(); };
              inputElement.onkeypress = function (e) {
                  // Enter pressed
                  if (e.keyCode == 13 && _this.inlineAction) {
                      _this.inlineAction.execute();
                  }
              };
              return inputElement;
          }
      };
      TextInput.prototype.overrideInternalRender = function () {
          var _this = this;
          var renderedInputControl = _super.prototype.overrideInternalRender.call(this);
          if (this.inlineAction) {
              var button_1 = document.createElement("button");
              button_1.className = this.hostConfig.makeCssClassName("ac-inlineActionButton");
              button_1.onclick = function (e) {
                  e.preventDefault();
                  e.cancelBubble = true;
                  _this.inlineAction.execute();
              };
              if (!utils.isNullOrEmpty(this.inlineAction.iconUrl)) {
                  button_1.classList.add("iconOnly");
                  var icon_1 = document.createElement("img");
                  icon_1.style.height = "100%";
                  // The below trick is necessary as a workaround in Chrome where the icon is initially displayed
                  // at its native size then resized to 100% of the button's height. This cfreates an unpleasant
                  // flicker. On top of that, Chrome's flex implementation fails to prperly re-layout the button
                  // after the image has loaded and been gicven its final size. The below trick also fixes that.
                  icon_1.style.display = "none";
                  icon_1.onload = function () {
                      icon_1.style.removeProperty("display");
                  };
                  icon_1.onerror = function () {
                      button_1.removeChild(icon_1);
                      button_1.classList.remove("iconOnly");
                      button_1.classList.add("textOnly");
                      button_1.textContent = !utils.isNullOrEmpty(_this.inlineAction.title) ? _this.inlineAction.title : "Title";
                  };
                  icon_1.src = this.inlineAction.iconUrl;
                  button_1.appendChild(icon_1);
                  if (!utils.isNullOrEmpty(this.inlineAction.title)) {
                      button_1.title = this.inlineAction.title;
                  }
              }
              else {
                  button_1.classList.add("textOnly");
                  button_1.textContent = !utils.isNullOrEmpty(this.inlineAction.title) ? this.inlineAction.title : "Title";
              }
              button_1.style.marginLeft = "8px";
              this.inputControlContainerElement.appendChild(button_1);
          }
          return renderedInputControl;
      };
      TextInput.prototype.getJsonTypeName = function () {
          return "Input.Text";
      };
      TextInput.prototype.getActionById = function (id) {
          var result = _super.prototype.getActionById.call(this, id);
          if (!result && this.inlineAction) {
              result = this.inlineAction.getActionById(id);
          }
          return result;
      };
      TextInput.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "placeholder", this.placeholder);
          utils.setProperty(result, "maxLength", this.maxLength, 0);
          utils.setProperty(result, "isMultiline", this.isMultiline, false);
          utils.setEnumProperty(enums.InputTextStyle, result, "style", this.style, enums.InputTextStyle.Text);
          if (this._inlineAction) {
              utils.setProperty(result, "inlineAction", this._inlineAction.toJSON());
          }
          return result;
      };
      TextInput.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.maxLength = json["maxLength"];
          this.isMultiline = utils.getBoolValue(json["isMultiline"], this.isMultiline);
          this.placeholder = utils.getStringValue(json["placeholder"]);
          this.style = utils.getEnumValue(enums.InputTextStyle, json["style"], this.style);
          this.inlineAction = createActionInstance(this, json["inlineAction"], [ShowCardAction.JsonTypeName], !this.isDesignMode(), errors);
      };
      Object.defineProperty(TextInput.prototype, "inlineAction", {
          get: function () {
              return this._inlineAction;
          },
          set: function (value) {
              this._inlineAction = value;
              if (this._inlineAction) {
                  this._inlineAction.setParent(this);
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(TextInput.prototype, "value", {
          get: function () {
              if (this.renderedInputControlElement) {
                  if (this.isMultiline) {
                      return this.renderedInputControlElement.value;
                  }
                  else {
                      return this.renderedInputControlElement.value;
                  }
              }
              else {
                  return null;
              }
          },
          enumerable: true,
          configurable: true
      });
      return TextInput;
  }(Input));
  exports.TextInput = TextInput;
  var ToggleInput = /** @class */ (function (_super) {
      __extends(ToggleInput, _super);
      function ToggleInput() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.valueOn = "true";
          _this.valueOff = "false";
          _this.wrap = false;
          return _this;
      }
      ToggleInput.prototype.internalRender = function () {
          var _this = this;
          var element = document.createElement("div");
          element.className = this.hostConfig.makeCssClassName("ac-input", "ac-toggleInput");
          element.style.width = "100%";
          element.style.display = "flex";
          element.style.alignItems = "center";
          this._checkboxInputElement = document.createElement("input");
          this._checkboxInputElement.id = utils.generateUniqueId();
          this._checkboxInputElement.type = "checkbox";
          this._checkboxInputElement.style.display = "inline-block";
          this._checkboxInputElement.style.verticalAlign = "middle";
          this._checkboxInputElement.style.margin = "0";
          this._checkboxInputElement.style.flex = "0 0 auto";
          this._checkboxInputElement.setAttribute("aria-label", this.title);
          this._checkboxInputElement.tabIndex = 0;
          if (this.defaultValue == this.valueOn) {
              this._checkboxInputElement.checked = true;
          }
          this._checkboxInputElement.onchange = function () { _this.valueChanged(); };
          utils.appendChild(element, this._checkboxInputElement);
          if (!utils.isNullOrEmpty(this.title) || this.isDesignMode()) {
              var label = new Label();
              label.setParent(this);
              label.forElementId = this._checkboxInputElement.id;
              label.hostConfig = this.hostConfig;
              label.text = utils.isNullOrEmpty(this.title) ? this.getJsonTypeName() : this.title;
              label.useMarkdown = AdaptiveCard.useMarkdownInRadioButtonAndCheckbox;
              label.wrap = this.wrap;
              var labelElement = label.render();
              labelElement.style.display = "inline-block";
              labelElement.style.flex = "1 1 auto";
              labelElement.style.marginLeft = "6px";
              labelElement.style.verticalAlign = "middle";
              var spacerElement = document.createElement("div");
              spacerElement.style.width = "6px";
              utils.appendChild(element, spacerElement);
              utils.appendChild(element, labelElement);
          }
          return element;
      };
      Object.defineProperty(ToggleInput.prototype, "isNullable", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      ToggleInput.prototype.getJsonTypeName = function () {
          return "Input.Toggle";
      };
      ToggleInput.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "valueOn", this.valueOn, "true");
          utils.setProperty(result, "valueOff", this.valueOff, "false");
          utils.setProperty(result, "wrap", this.wrap);
          return result;
      };
      ToggleInput.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.title = utils.getStringValue(json["title"]);
          this.valueOn = utils.getStringValue(json["valueOn"], this.valueOn);
          this.valueOff = utils.getStringValue(json["valueOff"], this.valueOff);
          this.wrap = utils.getBoolValue(json["wrap"], this.wrap);
      };
      Object.defineProperty(ToggleInput.prototype, "value", {
          get: function () {
              if (this._checkboxInputElement) {
                  return this._checkboxInputElement.checked ? this.valueOn : this.valueOff;
              }
              else {
                  return null;
              }
          },
          enumerable: true,
          configurable: true
      });
      return ToggleInput;
  }(Input));
  exports.ToggleInput = ToggleInput;
  var Choice = /** @class */ (function () {
      function Choice(title, value) {
          if (title === void 0) { title = undefined; }
          if (value === void 0) { value = undefined; }
          this.title = title;
          this.value = value;
      }
      Choice.prototype.parse = function (json) {
          this.title = utils.getStringValue(json["title"]);
          this.value = utils.getStringValue(json["value"]);
      };
      Choice.prototype.toJSON = function () {
          return { title: this.title, value: this.value };
      };
      return Choice;
  }());
  exports.Choice = Choice;
  var ChoiceSetInput = /** @class */ (function (_super) {
      __extends(ChoiceSetInput, _super);
      function ChoiceSetInput() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.choices = [];
          _this.isCompact = false;
          _this.isMultiSelect = false;
          _this.wrap = false;
          return _this;
      }
      ChoiceSetInput.getUniqueCategoryName = function () {
          var uniqueCwtegoryName = "__ac-category" + ChoiceSetInput.uniqueCategoryCounter;
          ChoiceSetInput.uniqueCategoryCounter++;
          return uniqueCwtegoryName;
      };
      ChoiceSetInput.prototype.internalRender = function () {
          var _this = this;
          if (!this.isMultiSelect) {
              if (this.isCompact) {
                  // Render as a combo box
                  this._selectElement = document.createElement("select");
                  this._selectElement.className = this.hostConfig.makeCssClassName("ac-input", "ac-multichoiceInput", "ac-choiceSetInput-compact");
                  this._selectElement.style.width = "100%";
                  var option = document.createElement("option");
                  option.selected = true;
                  option.disabled = true;
                  option.hidden = true;
                  option.value = "";
                  if (this.placeholder) {
                      option.text = this.placeholder;
                  }
                  utils.appendChild(this._selectElement, option);
                  for (var i = 0; i < this.choices.length; i++) {
                      var option_1 = document.createElement("option");
                      option_1.value = this.choices[i].value;
                      option_1.text = this.choices[i].title;
                      option_1.setAttribute("aria-label", this.choices[i].title);
                      if (this.choices[i].value == this.defaultValue) {
                          option_1.selected = true;
                      }
                      utils.appendChild(this._selectElement, option_1);
                  }
                  this._selectElement.onchange = function () { _this.valueChanged(); };
                  return this._selectElement;
              }
              else {
                  // Render as a series of radio buttons
                  var uniqueCategoryName = ChoiceSetInput.getUniqueCategoryName();
                  var element = document.createElement("div");
                  element.className = this.hostConfig.makeCssClassName("ac-input", "ac-choiceSetInput-expanded");
                  element.style.width = "100%";
                  this._toggleInputs = [];
                  for (var i_1 = 0; i_1 < this.choices.length; i_1++) {
                      var radioInput = document.createElement("input");
                      radioInput.id = utils.generateUniqueId();
                      radioInput.type = "radio";
                      radioInput.style.margin = "0";
                      radioInput.style.display = "inline-block";
                      radioInput.style.verticalAlign = "middle";
                      radioInput.name = utils.isNullOrEmpty(this.id) ? uniqueCategoryName : this.id;
                      radioInput.value = this.choices[i_1].value;
                      radioInput.style.flex = "0 0 auto";
                      radioInput.setAttribute("aria-label", this.choices[i_1].title);
                      if (this.choices[i_1].value == this.defaultValue) {
                          radioInput.checked = true;
                      }
                      radioInput.onchange = function () { _this.valueChanged(); };
                      this._toggleInputs.push(radioInput);
                      var label = new Label();
                      label.setParent(this);
                      label.forElementId = radioInput.id;
                      label.hostConfig = this.hostConfig;
                      label.text = utils.isNullOrEmpty(this.choices[i_1].title) ? "Choice " + i_1 : this.choices[i_1].title;
                      label.useMarkdown = AdaptiveCard.useMarkdownInRadioButtonAndCheckbox;
                      label.wrap = this.wrap;
                      var labelElement = label.render();
                      labelElement.style.display = "inline-block";
                      labelElement.style.flex = "1 1 auto";
                      labelElement.style.marginLeft = "6px";
                      labelElement.style.verticalAlign = "middle";
                      var spacerElement = document.createElement("div");
                      spacerElement.style.width = "6px";
                      var compoundInput = document.createElement("div");
                      compoundInput.style.display = "flex";
                      compoundInput.style.alignItems = "center";
                      utils.appendChild(compoundInput, radioInput);
                      utils.appendChild(compoundInput, spacerElement);
                      utils.appendChild(compoundInput, labelElement);
                      utils.appendChild(element, compoundInput);
                  }
                  return element;
              }
          }
          else {
              // Render as a list of toggle inputs
              var defaultValues = this.defaultValue ? this.defaultValue.split(this.hostConfig.choiceSetInputValueSeparator) : null;
              var element = document.createElement("div");
              element.className = this.hostConfig.makeCssClassName("ac-input", "ac-choiceSetInput-multiSelect");
              element.style.width = "100%";
              this._toggleInputs = [];
              for (var i_2 = 0; i_2 < this.choices.length; i_2++) {
                  var checkboxInput = document.createElement("input");
                  checkboxInput.id = utils.generateUniqueId();
                  checkboxInput.type = "checkbox";
                  checkboxInput.style.margin = "0";
                  checkboxInput.style.display = "inline-block";
                  checkboxInput.style.verticalAlign = "middle";
                  checkboxInput.value = this.choices[i_2].value;
                  checkboxInput.style.flex = "0 0 auto";
                  checkboxInput.setAttribute("aria-label", this.choices[i_2].title);
                  if (defaultValues) {
                      if (defaultValues.indexOf(this.choices[i_2].value) >= 0) {
                          checkboxInput.checked = true;
                      }
                  }
                  checkboxInput.onchange = function () { _this.valueChanged(); };
                  this._toggleInputs.push(checkboxInput);
                  var label = new Label();
                  label.setParent(this);
                  label.forElementId = checkboxInput.id;
                  label.hostConfig = this.hostConfig;
                  label.text = utils.isNullOrEmpty(this.choices[i_2].title) ? "Choice " + i_2 : this.choices[i_2].title;
                  label.useMarkdown = AdaptiveCard.useMarkdownInRadioButtonAndCheckbox;
                  label.wrap = this.wrap;
                  var labelElement = label.render();
                  labelElement.style.display = "inline-block";
                  labelElement.style.flex = "1 1 auto";
                  labelElement.style.marginLeft = "6px";
                  labelElement.style.verticalAlign = "middle";
                  var spacerElement = document.createElement("div");
                  spacerElement.style.width = "6px";
                  var compoundInput = document.createElement("div");
                  compoundInput.style.display = "flex";
                  compoundInput.style.alignItems = "center";
                  utils.appendChild(compoundInput, checkboxInput);
                  utils.appendChild(compoundInput, spacerElement);
                  utils.appendChild(compoundInput, labelElement);
                  utils.appendChild(element, compoundInput);
              }
              return element;
          }
      };
      ChoiceSetInput.prototype.getJsonTypeName = function () {
          return "Input.ChoiceSet";
      };
      ChoiceSetInput.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "placeholder", this.placeholder);
          if (this.choices.length > 0) {
              var choices = [];
              for (var _i = 0, _a = this.choices; _i < _a.length; _i++) {
                  var choice = _a[_i];
                  choices.push(choice.toJSON());
              }
              utils.setProperty(result, "choices", choices);
          }
          if (!this.isCompact) {
              utils.setProperty(result, "style", "expanded", false);
          }
          utils.setProperty(result, "isMultiSelect", this.isMultiSelect, false);
          utils.setProperty(result, "wrap", this.wrap, false);
          return result;
      };
      ChoiceSetInput.prototype.internalValidateProperties = function (context) {
          _super.prototype.internalValidateProperties.call(this, context);
          if (this.choices.length == 0) {
              context.addFailure(this, {
                  error: enums.ValidationError.CollectionCantBeEmpty,
                  message: "An Input.ChoiceSet must have at least one choice defined."
              });
          }
          for (var _i = 0, _a = this.choices; _i < _a.length; _i++) {
              var choice = _a[_i];
              if (!choice.title || !choice.value) {
                  context.addFailure(this, {
                      error: enums.ValidationError.PropertyCantBeNull,
                      message: "All choices in an Input.ChoiceSet must have their title and value properties set."
                  });
              }
          }
      };
      ChoiceSetInput.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.isCompact = !(json["style"] === "expanded");
          this.isMultiSelect = utils.getBoolValue(json["isMultiSelect"], this.isMultiSelect);
          this.placeholder = utils.getStringValue(json["placeholder"]);
          this.choices = [];
          if (json["choices"] != undefined) {
              var choiceArray = json["choices"];
              for (var i = 0; i < choiceArray.length; i++) {
                  var choice = new Choice();
                  choice.parse(choiceArray[i]);
                  this.choices.push(choice);
              }
          }
          this.wrap = utils.getBoolValue(json["wrap"], this.wrap);
      };
      Object.defineProperty(ChoiceSetInput.prototype, "value", {
          get: function () {
              if (!this.isMultiSelect) {
                  if (this.isCompact) {
                      if (this._selectElement) {
                          return this._selectElement.selectedIndex > 0 ? this._selectElement.value : null;
                      }
                      return null;
                  }
                  else {
                      if (!this._toggleInputs || this._toggleInputs.length == 0) {
                          return null;
                      }
                      for (var i = 0; i < this._toggleInputs.length; i++) {
                          if (this._toggleInputs[i].checked) {
                              return this._toggleInputs[i].value;
                          }
                      }
                      return null;
                  }
              }
              else {
                  if (!this._toggleInputs || this._toggleInputs.length == 0) {
                      return null;
                  }
                  var result = "";
                  for (var i = 0; i < this._toggleInputs.length; i++) {
                      if (this._toggleInputs[i].checked) {
                          if (result != "") {
                              result += this.hostConfig.choiceSetInputValueSeparator;
                          }
                          result += this._toggleInputs[i].value;
                      }
                  }
                  return result == "" ? null : result;
              }
          },
          enumerable: true,
          configurable: true
      });
      ChoiceSetInput.uniqueCategoryCounter = 0;
      return ChoiceSetInput;
  }(Input));
  exports.ChoiceSetInput = ChoiceSetInput;
  var NumberInput = /** @class */ (function (_super) {
      __extends(NumberInput, _super);
      function NumberInput() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      NumberInput.prototype.internalRender = function () {
          var _this = this;
          this._numberInputElement = document.createElement("input");
          this._numberInputElement.setAttribute("type", "number");
          this._numberInputElement.setAttribute("min", this.min);
          this._numberInputElement.setAttribute("max", this.max);
          this._numberInputElement.className = this.hostConfig.makeCssClassName("ac-input", "ac-numberInput");
          this._numberInputElement.style.width = "100%";
          this._numberInputElement.tabIndex = 0;
          if (!utils.isNullOrEmpty(this.defaultValue)) {
              this._numberInputElement.value = this.defaultValue;
          }
          if (!utils.isNullOrEmpty(this.placeholder)) {
              this._numberInputElement.placeholder = this.placeholder;
              this._numberInputElement.setAttribute("aria-label", this.placeholder);
          }
          this._numberInputElement.oninput = function () { _this.valueChanged(); };
          return this._numberInputElement;
      };
      NumberInput.prototype.getJsonTypeName = function () {
          return "Input.Number";
      };
      NumberInput.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "placeholder", this.placeholder);
          utils.setProperty(result, "min", this.min);
          utils.setProperty(result, "max", this.max);
          return result;
      };
      NumberInput.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.placeholder = utils.getStringValue(json["placeholder"]);
          this.min = utils.getStringValue(json["min"]);
          this.max = utils.getStringValue(json["max"]);
      };
      Object.defineProperty(NumberInput.prototype, "min", {
          get: function () {
              return this._min;
          },
          set: function (value) {
              this._min = this.parseInputValue(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(NumberInput.prototype, "max", {
          get: function () {
              return this._max;
          },
          set: function (value) {
              this._max = this.parseInputValue(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(NumberInput.prototype, "value", {
          get: function () {
              return this._numberInputElement ? this._numberInputElement.value : null;
          },
          enumerable: true,
          configurable: true
      });
      return NumberInput;
  }(Input));
  exports.NumberInput = NumberInput;
  var DateInput = /** @class */ (function (_super) {
      __extends(DateInput, _super);
      function DateInput() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      DateInput.prototype.internalRender = function () {
          var _this = this;
          this._dateInputElement = document.createElement("input");
          this._dateInputElement.setAttribute("type", "date");
          this._dateInputElement.setAttribute("min", this.min);
          this._dateInputElement.setAttribute("max", this.max);
          this._dateInputElement.className = this.hostConfig.makeCssClassName("ac-input", "ac-dateInput");
          this._dateInputElement.style.width = "100%";
          this._dateInputElement.oninput = function () { _this.valueChanged(); };
          if (!utils.isNullOrEmpty(this.defaultValue)) {
              this._dateInputElement.value = this.defaultValue;
          }
          return this._dateInputElement;
      };
      DateInput.prototype.getJsonTypeName = function () {
          return "Input.Date";
      };
      DateInput.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "min", this.min);
          utils.setProperty(result, "max", this.max);
          return result;
      };
      DateInput.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.min = utils.getStringValue(json["min"]);
          this.max = utils.getStringValue(json["max"]);
      };
      Object.defineProperty(DateInput.prototype, "min", {
          get: function () {
              return this._min;
          },
          set: function (value) {
              this._min = this.parseInputValue(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(DateInput.prototype, "max", {
          get: function () {
              return this._max;
          },
          set: function (value) {
              this._max = this.parseInputValue(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(DateInput.prototype, "value", {
          get: function () {
              return this._dateInputElement ? this._dateInputElement.value : null;
          },
          enumerable: true,
          configurable: true
      });
      return DateInput;
  }(Input));
  exports.DateInput = DateInput;
  var TimeInput = /** @class */ (function (_super) {
      __extends(TimeInput, _super);
      function TimeInput() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      TimeInput.prototype.internalRender = function () {
          var _this = this;
          this._timeInputElement = document.createElement("input");
          this._timeInputElement.setAttribute("type", "time");
          this._timeInputElement.setAttribute("min", this.min);
          this._timeInputElement.setAttribute("max", this.max);
          this._timeInputElement.className = this.hostConfig.makeCssClassName("ac-input", "ac-timeInput");
          this._timeInputElement.style.width = "100%";
          this._timeInputElement.oninput = function () { _this.valueChanged(); };
          if (!utils.isNullOrEmpty(this.defaultValue)) {
              this._timeInputElement.value = this.defaultValue;
          }
          return this._timeInputElement;
      };
      TimeInput.prototype.parseInputValue = function (value) {
          if (/^[0-9]{2}:[0-9]{2}$/.test(value)) {
              return value;
          }
          else {
              return null;
          }
      };
      TimeInput.prototype.getJsonTypeName = function () {
          return "Input.Time";
      };
      TimeInput.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "min", this.min);
          utils.setProperty(result, "max", this.max);
          return result;
      };
      TimeInput.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.min = utils.getStringValue(json["min"]);
          this.max = utils.getStringValue(json["max"]);
      };
      Object.defineProperty(TimeInput.prototype, "min", {
          get: function () {
              return this._min;
          },
          set: function (value) {
              this._min = this.parseInputValue(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(TimeInput.prototype, "max", {
          get: function () {
              return this._max;
          },
          set: function (value) {
              this._max = this.parseInputValue(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(TimeInput.prototype, "value", {
          get: function () {
              return this._timeInputElement ? this._timeInputElement.value : null;
          },
          enumerable: true,
          configurable: true
      });
      return TimeInput;
  }(Input));
  exports.TimeInput = TimeInput;
  var ActionButtonState;
  (function (ActionButtonState) {
      ActionButtonState[ActionButtonState["Normal"] = 0] = "Normal";
      ActionButtonState[ActionButtonState["Expanded"] = 1] = "Expanded";
      ActionButtonState[ActionButtonState["Subdued"] = 2] = "Subdued";
  })(ActionButtonState || (ActionButtonState = {}));
  var ActionButton = /** @class */ (function () {
      function ActionButton(action, parentContainerStyle) {
          this._state = ActionButtonState.Normal;
          this.onClick = null;
          this.action = action;
          this._parentContainerStyle = parentContainerStyle;
      }
      ActionButton.prototype.updateCssStyle = function () {
          var _a, _b;
          var hostConfig = this.action.parent.hostConfig;
          this.action.renderedElement.className = hostConfig.makeCssClassName("ac-pushButton");
          if (!utils.isNullOrEmpty(this._parentContainerStyle)) {
              this.action.renderedElement.classList.add("style-" + this._parentContainerStyle);
          }
          if (this.action instanceof ShowCardAction) {
              this.action.renderedElement.classList.add(hostConfig.makeCssClassName("expandable"));
          }
          this.action.renderedElement.classList.remove(hostConfig.makeCssClassName("expanded"));
          this.action.renderedElement.classList.remove(hostConfig.makeCssClassName("subdued"));
          switch (this._state) {
              case ActionButtonState.Expanded:
                  this.action.renderedElement.classList.add(hostConfig.makeCssClassName("expanded"));
                  break;
              case ActionButtonState.Subdued:
                  this.action.renderedElement.classList.add(hostConfig.makeCssClassName("subdued"));
                  break;
          }
          if (!utils.isNullOrEmpty(this.action.style)) {
              if (this.action.style === enums.ActionStyle.Positive) {
                  (_a = this.action.renderedElement.classList).add.apply(_a, hostConfig.makeCssClassNames("primary", "style-positive"));
              }
              else {
                  (_b = this.action.renderedElement.classList).add.apply(_b, hostConfig.makeCssClassNames("style-" + this.action.style.toLowerCase()));
              }
          }
      };
      ActionButton.prototype.render = function (alignment) {
          var _this = this;
          this.action.render();
          this.action.renderedElement.style.flex = alignment === enums.ActionAlignment.Stretch ? "0 1 100%" : "0 1 auto";
          this.action.renderedElement.onclick = function (e) {
              e.preventDefault();
              e.cancelBubble = true;
              _this.click();
          };
          this.updateCssStyle();
      };
      ActionButton.prototype.click = function () {
          if (this.onClick != null) {
              this.onClick(this);
          }
      };
      Object.defineProperty(ActionButton.prototype, "state", {
          get: function () {
              return this._state;
          },
          set: function (value) {
              this._state = value;
              this.updateCssStyle();
          },
          enumerable: true,
          configurable: true
      });
      return ActionButton;
  }());
  var Action = /** @class */ (function (_super) {
      __extends(Action, _super);
      function Action() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._shouldFallback = false;
          _this._parent = null;
          _this._actionCollection = null; // hold the reference to its action collection
          _this._renderedElement = null;
          _this.requires = new hostConfig.HostCapabilities();
          _this.style = enums.ActionStyle.Default;
          return _this;
      }
      Action.prototype.setCollection = function (actionCollection) {
          this._actionCollection = actionCollection;
      };
      Action.prototype.addCssClasses = function (element) {
          // Do nothing in base implementation
      };
      Action.prototype.internalGetReferencedInputs = function (allInputs) {
          return {};
      };
      Action.prototype.internalPrepareForExecution = function (inputs) {
          // Do nothing in base implementation
      };
      Action.prototype.internalValidateInputs = function (referencedInputs) {
          var result = [];
          if (AdaptiveCard.useBuiltInInputValidation && !this.ignoreInputValidation) {
              for (var _i = 0, _a = Object.keys(referencedInputs); _i < _a.length; _i++) {
                  var key = _a[_i];
                  var input = referencedInputs[key];
                  if (!input.validateValue()) {
                      result.push(input);
                  }
              }
          }
          return result;
      };
      Action.prototype.getHref = function () {
          return "";
      };
      Action.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "type", this.getJsonTypeName());
          utils.setProperty(result, "title", this.title);
          utils.setProperty(result, "iconUrl", this.iconUrl);
          utils.setProperty(result, "style", this.style, enums.ActionStyle.Default);
          return result;
      };
      Action.prototype.render = function (baseCssClass) {
          // Cache hostConfig for perf
          var hostConfig = this.parent.hostConfig;
          var buttonElement = document.createElement("button");
          this.addCssClasses(buttonElement);
          buttonElement.setAttribute("aria-label", this.title);
          buttonElement.type = "button";
          buttonElement.style.display = "flex";
          buttonElement.style.alignItems = "center";
          buttonElement.style.justifyContent = "center";
          var hasTitle = !utils.isNullOrEmpty(this.title);
          var titleElement = document.createElement("div");
          titleElement.style.overflow = "hidden";
          titleElement.style.textOverflow = "ellipsis";
          if (!(hostConfig.actions.iconPlacement == enums.ActionIconPlacement.AboveTitle || hostConfig.actions.allowTitleToWrap)) {
              titleElement.style.whiteSpace = "nowrap";
          }
          if (hasTitle) {
              titleElement.innerText = this.title;
          }
          if (utils.isNullOrEmpty(this.iconUrl)) {
              buttonElement.classList.add("noIcon");
              buttonElement.appendChild(titleElement);
          }
          else {
              var iconElement = document.createElement("img");
              iconElement.src = this.iconUrl;
              iconElement.style.width = hostConfig.actions.iconSize + "px";
              iconElement.style.height = hostConfig.actions.iconSize + "px";
              iconElement.style.flex = "0 0 auto";
              if (hostConfig.actions.iconPlacement == enums.ActionIconPlacement.AboveTitle) {
                  buttonElement.classList.add("iconAbove");
                  buttonElement.style.flexDirection = "column";
                  if (hasTitle) {
                      iconElement.style.marginBottom = "4px";
                  }
              }
              else {
                  buttonElement.classList.add("iconLeft");
                  if (hasTitle) {
                      iconElement.style.marginRight = "4px";
                  }
              }
              buttonElement.appendChild(iconElement);
              buttonElement.appendChild(titleElement);
          }
          this._renderedElement = buttonElement;
      };
      Action.prototype.setParent = function (value) {
          this._parent = value;
      };
      Action.prototype.execute = function () {
          if (this.onExecute) {
              this.onExecute(this);
          }
          raiseExecuteActionEvent(this);
      };
      Action.prototype.prepareForExecution = function () {
          var referencedInputs = this.getReferencedInputs();
          if (this.internalValidateInputs(referencedInputs).length > 0) {
              return false;
          }
          this.internalPrepareForExecution(referencedInputs);
          return true;
      };
      Action.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          raiseParseActionEvent(this, json, errors);
          this.requires.parse(json["requires"], errors);
          if (!json["title"] && json["title"] !== "") {
              raiseParseError({
                  error: enums.ValidationError.PropertyCantBeNull,
                  message: "Actions should always have a title."
              }, errors);
          }
          this.title = utils.getStringValue(json["title"]);
          this.iconUrl = utils.getStringValue(json["iconUrl"]);
          this.style = utils.getStringValue(json["style"], this.style);
      };
      Action.prototype.remove = function () {
          if (this._actionCollection) {
              return this._actionCollection.removeAction(this);
          }
          return false;
      };
      Action.prototype.getAllInputs = function () {
          return [];
      };
      Action.prototype.getResourceInformation = function () {
          if (!utils.isNullOrEmpty(this.iconUrl)) {
              return [{ url: this.iconUrl, mimeType: "image" }];
          }
          else {
              return [];
          }
      };
      Action.prototype.getActionById = function (id) {
          if (this.id == id) {
              return this;
          }
      };
      Action.prototype.getReferencedInputs = function () {
          return this.internalGetReferencedInputs(this.parent.getRootElement().getAllInputs());
      };
      Action.prototype.validateInputs = function () {
          return this.internalValidateInputs(this.getReferencedInputs());
      };
      Action.prototype.shouldFallback = function () {
          return this._shouldFallback || !this.requires.areAllMet(this.parent.hostConfig.hostCapabilities);
      };
      Object.defineProperty(Action.prototype, "isPrimary", {
          get: function () {
              return this.style == enums.ActionStyle.Positive;
          },
          set: function (value) {
              if (value) {
                  this.style = enums.ActionStyle.Positive;
              }
              else {
                  if (this.style == enums.ActionStyle.Positive) {
                      this.style = enums.ActionStyle.Default;
                  }
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Action.prototype, "ignoreInputValidation", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Action.prototype, "parent", {
          get: function () {
              return this._parent;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Action.prototype, "renderedElement", {
          get: function () {
              return this._renderedElement;
          },
          enumerable: true,
          configurable: true
      });
      return Action;
  }(CardObject));
  exports.Action = Action;
  var SubmitAction = /** @class */ (function (_super) {
      __extends(SubmitAction, _super);
      function SubmitAction() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._isPrepared = false;
          _this._ignoreInputValidation = false;
          return _this;
      }
      SubmitAction.prototype.internalGetReferencedInputs = function (allInputs) {
          var result = {};
          for (var _i = 0, allInputs_1 = allInputs; _i < allInputs_1.length; _i++) {
              var input = allInputs_1[_i];
              result[input.id] = input;
          }
          return result;
      };
      SubmitAction.prototype.internalPrepareForExecution = function (inputs) {
          if (this._originalData) {
              this._processedData = JSON.parse(JSON.stringify(this._originalData));
          }
          else {
              this._processedData = {};
          }
          for (var _i = 0, _a = Object.keys(inputs); _i < _a.length; _i++) {
              var key = _a[_i];
              var input = inputs[key];
              if (input.value != null) {
                  this._processedData[input.id] = input.value;
              }
          }
          this._isPrepared = true;
      };
      SubmitAction.prototype.getJsonTypeName = function () {
          return SubmitAction.JsonTypeName;
      };
      SubmitAction.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "ignoreInputValidation", this.ignoreInputValidation, false);
          utils.setProperty(result, "data", this._originalData);
          return result;
      };
      SubmitAction.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this._ignoreInputValidation = utils.getBoolValue(json["ignoreInputValidation"], this._ignoreInputValidation);
          this.data = json["data"];
      };
      Object.defineProperty(SubmitAction.prototype, "ignoreInputValidation", {
          get: function () {
              return this._ignoreInputValidation;
          },
          set: function (value) {
              this._ignoreInputValidation = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SubmitAction.prototype, "data", {
          get: function () {
              return this._isPrepared ? this._processedData : this._originalData;
          },
          set: function (value) {
              this._originalData = value;
              this._isPrepared = false;
          },
          enumerable: true,
          configurable: true
      });
      SubmitAction.JsonTypeName = "Action.Submit";
      return SubmitAction;
  }(Action));
  exports.SubmitAction = SubmitAction;
  var OpenUrlAction = /** @class */ (function (_super) {
      __extends(OpenUrlAction, _super);
      function OpenUrlAction() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      OpenUrlAction.prototype.getJsonTypeName = function () {
          return OpenUrlAction.JsonTypeName;
      };
      OpenUrlAction.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "url", this.url);
          return result;
      };
      OpenUrlAction.prototype.internalValidateProperties = function (context) {
          _super.prototype.internalValidateProperties.call(this, context);
          if (utils.isNullOrEmpty(this.url)) {
              context.addFailure(this, {
                  error: enums.ValidationError.PropertyCantBeNull,
                  message: "An Action.OpenUrl must have its url property set."
              });
          }
      };
      OpenUrlAction.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.url = utils.getStringValue(json["url"]);
      };
      OpenUrlAction.prototype.getHref = function () {
          return this.url;
      };
      OpenUrlAction.JsonTypeName = "Action.OpenUrl";
      return OpenUrlAction;
  }(Action));
  exports.OpenUrlAction = OpenUrlAction;
  var ToggleVisibilityAction = /** @class */ (function (_super) {
      __extends(ToggleVisibilityAction, _super);
      function ToggleVisibilityAction() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.targetElements = {};
          return _this;
      }
      ToggleVisibilityAction.prototype.getJsonTypeName = function () {
          return ToggleVisibilityAction.JsonTypeName;
      };
      ToggleVisibilityAction.prototype.execute = function () {
          for (var _i = 0, _a = Object.keys(this.targetElements); _i < _a.length; _i++) {
              var elementId = _a[_i];
              var targetElement = this.parent.getRootElement().getElementById(elementId);
              if (targetElement) {
                  if (typeof this.targetElements[elementId] === "boolean") {
                      targetElement.isVisible = this.targetElements[elementId];
                  }
                  else {
                      targetElement.isVisible = !targetElement.isVisible;
                  }
              }
          }
      };
      ToggleVisibilityAction.prototype.parse = function (json) {
          _super.prototype.parse.call(this, json);
          this.targetElements = {};
          var jsonTargetElements = json["targetElements"];
          if (jsonTargetElements && Array.isArray(jsonTargetElements)) {
              for (var _i = 0, jsonTargetElements_1 = jsonTargetElements; _i < jsonTargetElements_1.length; _i++) {
                  var item = jsonTargetElements_1[_i];
                  if (typeof item === "string") {
                      this.targetElements[item] = undefined;
                  }
                  else if (typeof item === "object") {
                      var jsonElementId = item["elementId"];
                      if (jsonElementId && typeof jsonElementId === "string") {
                          this.targetElements[jsonElementId] = utils.getBoolValue(item["isVisible"], undefined);
                      }
                  }
              }
          }
      };
      ToggleVisibilityAction.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          var targetElements = [];
          for (var _i = 0, _a = Object.keys(this.targetElements); _i < _a.length; _i++) {
              var id = _a[_i];
              if (typeof this.targetElements[id] === "boolean") {
                  targetElements.push({
                      elementId: id,
                      isVisible: this.targetElements[id]
                  });
              }
              else {
                  targetElements.push(id);
              }
          }
          result["targetElements"] = targetElements;
          return result;
      };
      ToggleVisibilityAction.prototype.addTargetElement = function (elementId, isVisible) {
          if (isVisible === void 0) { isVisible = undefined; }
          this.targetElements[elementId] = isVisible;
      };
      ToggleVisibilityAction.prototype.removeTargetElement = function (elementId) {
          delete this.targetElements[elementId];
      };
      ToggleVisibilityAction.JsonTypeName = "Action.ToggleVisibility";
      return ToggleVisibilityAction;
  }(Action));
  exports.ToggleVisibilityAction = ToggleVisibilityAction;
  var HttpHeader = /** @class */ (function () {
      function HttpHeader(name, value) {
          if (name === void 0) { name = ""; }
          if (value === void 0) { value = ""; }
          this._value = new shared.StringWithSubstitutions();
          this.name = name;
          this.value = value;
      }
      HttpHeader.prototype.parse = function (json) {
          this.name = utils.getStringValue(json["name"]);
          this.value = utils.getStringValue(json["value"]);
      };
      HttpHeader.prototype.toJSON = function () {
          return { name: this.name, value: this._value.getOriginal() };
      };
      HttpHeader.prototype.getReferencedInputs = function (inputs, referencedInputs) {
          this._value.getReferencedInputs(inputs, referencedInputs);
      };
      HttpHeader.prototype.prepareForExecution = function (inputs) {
          this._value.substituteInputValues(inputs, shared.ContentTypes.applicationXWwwFormUrlencoded);
      };
      Object.defineProperty(HttpHeader.prototype, "value", {
          get: function () {
              return this._value.get();
          },
          set: function (newValue) {
              this._value.set(newValue);
          },
          enumerable: true,
          configurable: true
      });
      return HttpHeader;
  }());
  exports.HttpHeader = HttpHeader;
  var HttpAction = /** @class */ (function (_super) {
      __extends(HttpAction, _super);
      function HttpAction() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._url = new shared.StringWithSubstitutions();
          _this._body = new shared.StringWithSubstitutions();
          _this._headers = [];
          _this._ignoreInputValidation = false;
          return _this;
      }
      HttpAction.prototype.internalGetReferencedInputs = function (allInputs) {
          var result = {};
          this._url.getReferencedInputs(allInputs, result);
          for (var _i = 0, _a = this._headers; _i < _a.length; _i++) {
              var header = _a[_i];
              header.getReferencedInputs(allInputs, result);
          }
          this._body.getReferencedInputs(allInputs, result);
          return result;
      };
      HttpAction.prototype.internalPrepareForExecution = function (inputs) {
          this._url.substituteInputValues(inputs, shared.ContentTypes.applicationXWwwFormUrlencoded);
          var contentType = shared.ContentTypes.applicationJson;
          for (var _i = 0, _a = this._headers; _i < _a.length; _i++) {
              var header = _a[_i];
              header.prepareForExecution(inputs);
              if (header.name && header.name.toLowerCase() == "content-type") {
                  contentType = header.value;
              }
          }
          this._body.substituteInputValues(inputs, contentType);
      };
      HttpAction.prototype.getJsonTypeName = function () {
          return HttpAction.JsonTypeName;
      };
      HttpAction.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "method", this.method);
          utils.setProperty(result, "url", this._url.getOriginal());
          utils.setProperty(result, "body", this._body.getOriginal());
          utils.setProperty(result, "ignoreInputValidation", this.ignoreInputValidation, false);
          if (this._headers.length > 0) {
              var headers = [];
              for (var _i = 0, _a = this._headers; _i < _a.length; _i++) {
                  var header = _a[_i];
                  headers.push(header.toJSON());
              }
              utils.setProperty(result, "headers", headers);
          }
          return result;
      };
      HttpAction.prototype.internalValidateProperties = function (context) {
          _super.prototype.internalValidateProperties.call(this, context);
          if (utils.isNullOrEmpty(this.url)) {
              context.addFailure(this, {
                  error: enums.ValidationError.PropertyCantBeNull,
                  message: "An Action.Http must have its url property set."
              });
          }
          if (this.headers.length > 0) {
              for (var _i = 0, _a = this.headers; _i < _a.length; _i++) {
                  var header = _a[_i];
                  if (!header.name) {
                      context.addFailure(this, {
                          error: enums.ValidationError.PropertyCantBeNull,
                          message: "All headers of an Action.Http must have their name and value properties set."
                      });
                  }
              }
          }
      };
      HttpAction.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.url = utils.getStringValue(json["url"]);
          this.method = utils.getStringValue(json["method"]);
          this.body = utils.getStringValue(json["body"]);
          this._ignoreInputValidation = utils.getBoolValue(json["ignoreInputValidation"], this._ignoreInputValidation);
          this._headers = [];
          if (json["headers"] != null) {
              var jsonHeaders = json["headers"];
              for (var i = 0; i < jsonHeaders.length; i++) {
                  var httpHeader = new HttpHeader();
                  httpHeader.parse(jsonHeaders[i]);
                  this.headers.push(httpHeader);
              }
          }
      };
      Object.defineProperty(HttpAction.prototype, "ignoreInputValidation", {
          get: function () {
              return this._ignoreInputValidation;
          },
          set: function (value) {
              this._ignoreInputValidation = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(HttpAction.prototype, "url", {
          get: function () {
              return this._url.get();
          },
          set: function (value) {
              this._url.set(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(HttpAction.prototype, "body", {
          get: function () {
              return this._body.get();
          },
          set: function (value) {
              this._body.set(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(HttpAction.prototype, "headers", {
          get: function () {
              return this._headers ? this._headers : [];
          },
          set: function (value) {
              this._headers = value;
          },
          enumerable: true,
          configurable: true
      });
      HttpAction.JsonTypeName = "Action.Http";
      return HttpAction;
  }(Action));
  exports.HttpAction = HttpAction;
  var ShowCardAction = /** @class */ (function (_super) {
      __extends(ShowCardAction, _super);
      function ShowCardAction() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.card = new InlineAdaptiveCard();
          return _this;
      }
      ShowCardAction.prototype.addCssClasses = function (element) {
          _super.prototype.addCssClasses.call(this, element);
          element.classList.add(this.parent.hostConfig.makeCssClassName("expandable"));
      };
      ShowCardAction.prototype.getJsonTypeName = function () {
          return ShowCardAction.JsonTypeName;
      };
      ShowCardAction.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          if (this.card) {
              utils.setProperty(result, "card", this.card.toJSON());
          }
          return result;
      };
      ShowCardAction.prototype.internalValidateProperties = function (context) {
          _super.prototype.internalValidateProperties.call(this, context);
          this.card.internalValidateProperties(context);
      };
      ShowCardAction.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          var jsonCard = json["card"];
          if (jsonCard) {
              this.card.parse(jsonCard, errors);
          }
          else {
              raiseParseError({
                  error: enums.ValidationError.PropertyCantBeNull,
                  message: "An Action.ShowCard must have its \"card\" property set to a valid AdaptiveCard object."
              }, errors);
          }
      };
      ShowCardAction.prototype.setParent = function (value) {
          _super.prototype.setParent.call(this, value);
          this.card.setParent(value);
      };
      ShowCardAction.prototype.getAllInputs = function () {
          return this.card.getAllInputs();
      };
      ShowCardAction.prototype.getResourceInformation = function () {
          return _super.prototype.getResourceInformation.call(this).concat(this.card.getResourceInformation());
      };
      ShowCardAction.prototype.getActionById = function (id) {
          var result = _super.prototype.getActionById.call(this, id);
          if (!result) {
              result = this.card.getActionById(id);
          }
          return result;
      };
      ShowCardAction.JsonTypeName = "Action.ShowCard";
      return ShowCardAction;
  }(Action));
  exports.ShowCardAction = ShowCardAction;
  var ActionCollection = /** @class */ (function () {
      function ActionCollection(owner) {
          this._expandedAction = null;
          this._renderedActionCount = 0;
          this._actionCard = null;
          this.items = [];
          this.buttons = [];
          this._owner = owner;
      }
      ActionCollection.prototype.refreshContainer = function () {
          this._actionCardContainer.innerHTML = "";
          if (this._actionCard === null) {
              this._actionCardContainer.style.marginTop = "0px";
              return;
          }
          this._actionCardContainer.style.marginTop = this._renderedActionCount > 0 ? this._owner.hostConfig.actions.showCard.inlineTopMargin + "px" : "0px";
          var padding = this._owner.getEffectivePadding();
          this._owner.getImmediateSurroundingPadding(padding);
          var physicalPadding = this._owner.hostConfig.paddingDefinitionToSpacingDefinition(padding);
          if (this._actionCard !== null) {
              this._actionCard.style.paddingLeft = physicalPadding.left + "px";
              this._actionCard.style.paddingRight = physicalPadding.right + "px";
              this._actionCard.style.marginLeft = "-" + physicalPadding.left + "px";
              this._actionCard.style.marginRight = "-" + physicalPadding.right + "px";
              if (physicalPadding.bottom != 0 && !this._owner.isDesignMode()) {
                  this._actionCard.style.paddingBottom = physicalPadding.bottom + "px";
                  this._actionCard.style.marginBottom = "-" + physicalPadding.bottom + "px";
              }
              utils.appendChild(this._actionCardContainer, this._actionCard);
          }
      };
      ActionCollection.prototype.layoutChanged = function () {
          this._owner.getRootElement().updateLayout();
      };
      ActionCollection.prototype.hideActionCard = function () {
          var previouslyExpandedAction = this._expandedAction;
          this._expandedAction = null;
          this._actionCard = null;
          this.refreshContainer();
          if (previouslyExpandedAction) {
              this.layoutChanged();
              raiseInlineCardExpandedEvent(previouslyExpandedAction, false);
          }
      };
      ActionCollection.prototype.showActionCard = function (action, suppressStyle, raiseEvent) {
          if (suppressStyle === void 0) { suppressStyle = false; }
          if (raiseEvent === void 0) { raiseEvent = true; }
          if (action.card == null) {
              return;
          }
          action.card.suppressStyle = suppressStyle;
          var renderedCard = action.card.render();
          this._actionCard = renderedCard;
          this._expandedAction = action;
          this.refreshContainer();
          if (raiseEvent) {
              this.layoutChanged();
              raiseInlineCardExpandedEvent(action, true);
          }
      };
      ActionCollection.prototype.collapseExpandedAction = function () {
          for (var i = 0; i < this.buttons.length; i++) {
              this.buttons[i].state = ActionButtonState.Normal;
          }
          this.hideActionCard();
      };
      ActionCollection.prototype.expandShowCardAction = function (action, raiseEvent) {
          for (var i = 0; i < this.buttons.length; i++) {
              if (this.buttons[i].action !== action) {
                  this.buttons[i].state = ActionButtonState.Subdued;
              }
              else {
                  this.buttons[i].state = ActionButtonState.Expanded;
              }
          }
          this.showActionCard(action, !(this._owner.isAtTheVeryLeft() && this._owner.isAtTheVeryRight()), raiseEvent);
      };
      ActionCollection.prototype.actionClicked = function (actionButton) {
          if (!(actionButton.action instanceof ShowCardAction)) {
              for (var i = 0; i < this.buttons.length; i++) {
                  this.buttons[i].state = ActionButtonState.Normal;
              }
              this.hideActionCard();
              actionButton.action.execute();
          }
          else {
              if (this._owner.hostConfig.actions.showCard.actionMode === enums.ShowCardActionMode.Popup) {
                  actionButton.action.execute();
              }
              else if (actionButton.action === this._expandedAction) {
                  this.collapseExpandedAction();
              }
              else {
                  this.expandShowCardAction(actionButton.action, true);
              }
          }
      };
      ActionCollection.prototype.getParentContainer = function () {
          if (this._owner instanceof Container) {
              return this._owner;
          }
          else {
              return this._owner.getParentContainer();
          }
      };
      ActionCollection.prototype.findActionButton = function (action) {
          for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
              var actionButton = _a[_i];
              if (actionButton.action == action) {
                  return actionButton;
              }
          }
          return null;
      };
      ActionCollection.prototype.parse = function (json, errors) {
          this.clear();
          if (json && json instanceof Array) {
              for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
                  var jsonAction = json_1[_i];
                  var action = createActionInstance(this._owner, jsonAction, [], !this._owner.isDesignMode(), errors);
                  if (action) {
                      this.addAction(action);
                  }
              }
          }
      };
      ActionCollection.prototype.toJSON = function () {
          if (this.items.length > 0) {
              var result = [];
              for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                  var action = _a[_i];
                  result.push(action.toJSON());
              }
              return result;
          }
          else {
              return null;
          }
      };
      ActionCollection.prototype.getActionById = function (id) {
          var result = null;
          for (var i = 0; i < this.items.length; i++) {
              result = this.items[i].getActionById(id);
              if (result) {
                  break;
              }
          }
          return result;
      };
      ActionCollection.prototype.validateProperties = function (context) {
          if (this._owner.hostConfig.actions.maxActions && this.items.length > this._owner.hostConfig.actions.maxActions) {
              context.addFailure(this._owner, {
                  error: enums.ValidationError.TooManyActions,
                  message: "A maximum of " + this._owner.hostConfig.actions.maxActions + " actions are allowed."
              });
          }
          if (this.items.length > 0 && !this._owner.hostConfig.supportsInteractivity) {
              context.addFailure(this._owner, {
                  error: enums.ValidationError.InteractivityNotAllowed,
                  message: "Interactivity is not allowed."
              });
          }
          for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
              var item = _a[_i];
              if (!isActionAllowed(item, this._owner.getForbiddenActionTypes())) {
                  context.addFailure(this._owner, {
                      error: enums.ValidationError.ActionTypeNotAllowed,
                      message: "Actions of type " + item.getJsonTypeName() + " are not allowe."
                  });
              }
              item.internalValidateProperties(context);
          }
      };
      ActionCollection.prototype.render = function (orientation, isDesignMode) {
          var _this = this;
          if (!this._owner.hostConfig.supportsInteractivity) {
              return null;
          }
          var element = document.createElement("div");
          var maxActions = this._owner.hostConfig.actions.maxActions ? Math.min(this._owner.hostConfig.actions.maxActions, this.items.length) : this.items.length;
          var forbiddenActionTypes = this._owner.getForbiddenActionTypes();
          this._actionCardContainer = document.createElement("div");
          this._renderedActionCount = 0;
          if (this._owner.hostConfig.actions.preExpandSingleShowCardAction && maxActions == 1 && this.items[0] instanceof ShowCardAction && isActionAllowed(this.items[0], forbiddenActionTypes)) {
              this.showActionCard(this.items[0], true);
              this._renderedActionCount = 1;
          }
          else {
              var buttonStrip = document.createElement("div");
              buttonStrip.className = this._owner.hostConfig.makeCssClassName("ac-actionSet");
              buttonStrip.style.display = "flex";
              if (orientation == enums.Orientation.Horizontal) {
                  buttonStrip.style.flexDirection = "row";
                  if (this._owner.horizontalAlignment && this._owner.hostConfig.actions.actionAlignment != enums.ActionAlignment.Stretch) {
                      switch (this._owner.horizontalAlignment) {
                          case enums.HorizontalAlignment.Center:
                              buttonStrip.style.justifyContent = "center";
                              break;
                          case enums.HorizontalAlignment.Right:
                              buttonStrip.style.justifyContent = "flex-end";
                              break;
                          default:
                              buttonStrip.style.justifyContent = "flex-start";
                              break;
                      }
                  }
                  else {
                      switch (this._owner.hostConfig.actions.actionAlignment) {
                          case enums.ActionAlignment.Center:
                              buttonStrip.style.justifyContent = "center";
                              break;
                          case enums.ActionAlignment.Right:
                              buttonStrip.style.justifyContent = "flex-end";
                              break;
                          default:
                              buttonStrip.style.justifyContent = "flex-start";
                              break;
                      }
                  }
              }
              else {
                  buttonStrip.style.flexDirection = "column";
                  if (this._owner.horizontalAlignment && this._owner.hostConfig.actions.actionAlignment != enums.ActionAlignment.Stretch) {
                      switch (this._owner.horizontalAlignment) {
                          case enums.HorizontalAlignment.Center:
                              buttonStrip.style.alignItems = "center";
                              break;
                          case enums.HorizontalAlignment.Right:
                              buttonStrip.style.alignItems = "flex-end";
                              break;
                          default:
                              buttonStrip.style.alignItems = "flex-start";
                              break;
                      }
                  }
                  else {
                      switch (this._owner.hostConfig.actions.actionAlignment) {
                          case enums.ActionAlignment.Center:
                              buttonStrip.style.alignItems = "center";
                              break;
                          case enums.ActionAlignment.Right:
                              buttonStrip.style.alignItems = "flex-end";
                              break;
                          case enums.ActionAlignment.Stretch:
                              buttonStrip.style.alignItems = "stretch";
                              break;
                          default:
                              buttonStrip.style.alignItems = "flex-start";
                              break;
                      }
                  }
              }
              var parentContainerStyle = this.getParentContainer().getEffectiveStyle();
              for (var i = 0; i < this.items.length; i++) {
                  if (isActionAllowed(this.items[i], forbiddenActionTypes)) {
                      var actionButton = this.findActionButton(this.items[i]);
                      if (!actionButton) {
                          actionButton = new ActionButton(this.items[i], parentContainerStyle);
                          actionButton.onClick = function (ab) { _this.actionClicked(ab); };
                          this.buttons.push(actionButton);
                      }
                      actionButton.render(this._owner.hostConfig.actions.actionAlignment);
                      buttonStrip.appendChild(actionButton.action.renderedElement);
                      this._renderedActionCount++;
                      if (this._renderedActionCount >= this._owner.hostConfig.actions.maxActions || i == this.items.length - 1) {
                          break;
                      }
                      else if (this._owner.hostConfig.actions.buttonSpacing > 0) {
                          var spacer = document.createElement("div");
                          if (orientation === enums.Orientation.Horizontal) {
                              spacer.style.flex = "0 0 auto";
                              spacer.style.width = this._owner.hostConfig.actions.buttonSpacing + "px";
                          }
                          else {
                              spacer.style.height = this._owner.hostConfig.actions.buttonSpacing + "px";
                          }
                          utils.appendChild(buttonStrip, spacer);
                      }
                  }
              }
              var buttonStripContainer = document.createElement("div");
              buttonStripContainer.style.overflow = "hidden";
              buttonStripContainer.appendChild(buttonStrip);
              utils.appendChild(element, buttonStripContainer);
          }
          utils.appendChild(element, this._actionCardContainer);
          for (var i = 0; i < this.buttons.length; i++) {
              if (this.buttons[i].state == ActionButtonState.Expanded) {
                  this.expandShowCardAction(this.buttons[i].action, false);
                  break;
              }
          }
          return this._renderedActionCount > 0 ? element : null;
      };
      ActionCollection.prototype.addAction = function (action) {
          if (!action) {
              throw new Error("The action parameter cannot be null.");
          }
          if ((!action.parent || action.parent === this._owner) && this.items.indexOf(action) < 0) {
              this.items.push(action);
              if (!action.parent) {
                  action.setParent(this._owner);
              }
              invokeSetCollection(action, this);
          }
          else {
              throw new Error("The action already belongs to another element.");
          }
      };
      ActionCollection.prototype.removeAction = function (action) {
          if (this.expandedAction && this._expandedAction == action) {
              this.collapseExpandedAction();
          }
          var actionIndex = this.items.indexOf(action);
          if (actionIndex >= 0) {
              this.items.splice(actionIndex, 1);
              action.setParent(null);
              invokeSetCollection(action, null);
              for (var i = 0; i < this.buttons.length; i++) {
                  if (this.buttons[i].action == action) {
                      this.buttons.splice(i, 1);
                      break;
                  }
              }
              return true;
          }
          return false;
      };
      ActionCollection.prototype.clear = function () {
          this.items = [];
          this.buttons = [];
          this._expandedAction = null;
          this._renderedActionCount = 0;
      };
      ActionCollection.prototype.getAllInputs = function () {
          var result = [];
          for (var i = 0; i < this.items.length; i++) {
              var action = this.items[i];
              result = result.concat(action.getAllInputs());
          }
          return result;
      };
      ActionCollection.prototype.getResourceInformation = function () {
          var result = [];
          for (var i = 0; i < this.items.length; i++) {
              result = result.concat(this.items[i].getResourceInformation());
          }
          return result;
      };
      Object.defineProperty(ActionCollection.prototype, "renderedActionCount", {
          get: function () {
              return this._renderedActionCount;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ActionCollection.prototype, "expandedAction", {
          get: function () {
              return this._expandedAction;
          },
          enumerable: true,
          configurable: true
      });
      return ActionCollection;
  }());
  var ActionSet = /** @class */ (function (_super) {
      __extends(ActionSet, _super);
      function ActionSet() {
          var _this = _super.call(this) || this;
          _this.orientation = null;
          _this._actionCollection = new ActionCollection(_this);
          return _this;
      }
      ActionSet.prototype.internalRender = function () {
          return this._actionCollection.render(this.orientation ? this.orientation : this.hostConfig.actions.actionsOrientation, this.isDesignMode());
      };
      ActionSet.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setEnumProperty(enums.Orientation, result, "orientation", this.orientation);
          utils.setProperty(result, "actions", this._actionCollection.toJSON());
          return result;
      };
      ActionSet.prototype.isBleedingAtBottom = function () {
          if (this._actionCollection.renderedActionCount == 0) {
              return _super.prototype.isBleedingAtBottom.call(this);
          }
          else {
              if (this._actionCollection.items.length == 1) {
                  return this._actionCollection.expandedAction != null && !this.hostConfig.actions.preExpandSingleShowCardAction;
              }
              else {
                  return this._actionCollection.expandedAction != null;
              }
          }
      };
      ActionSet.prototype.getJsonTypeName = function () {
          return "ActionSet";
      };
      ActionSet.prototype.getActionCount = function () {
          return this._actionCollection.items.length;
      };
      ActionSet.prototype.getActionAt = function (index) {
          if (index >= 0 && index < this.getActionCount()) {
              return this._actionCollection.items[index];
          }
          else {
              _super.prototype.getActionAt.call(this, index);
          }
      };
      ActionSet.prototype.internalValidateProperties = function (context) {
          _super.prototype.internalValidateProperties.call(this, context);
          this._actionCollection.validateProperties(context);
      };
      ActionSet.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          var jsonOrientation = json["orientation"];
          if (jsonOrientation) {
              this.orientation = utils.getEnumValue(enums.Orientation, jsonOrientation, enums.Orientation.Horizontal);
          }
          this._actionCollection.parse(json["actions"], errors);
      };
      ActionSet.prototype.addAction = function (action) {
          this._actionCollection.addAction(action);
      };
      ActionSet.prototype.getAllInputs = function () {
          return this._actionCollection.getAllInputs();
      };
      ActionSet.prototype.getResourceInformation = function () {
          return this._actionCollection.getResourceInformation();
      };
      Object.defineProperty(ActionSet.prototype, "isInteractive", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      return ActionSet;
  }(CardElement));
  exports.ActionSet = ActionSet;
  var StylableCardElementContainer = /** @class */ (function (_super) {
      __extends(StylableCardElementContainer, _super);
      function StylableCardElementContainer() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._style = null;
          _this._bleed = false;
          return _this;
      }
      StylableCardElementContainer.prototype.applyBackground = function () {
          var styleDefinition = this.hostConfig.containerStyles.getStyleByName(this.style, this.hostConfig.containerStyles.getStyleByName(this.defaultStyle));
          if (!utils.isNullOrEmpty(styleDefinition.backgroundColor)) {
              this.renderedElement.style.backgroundColor = utils.stringToCssColor(styleDefinition.backgroundColor);
          }
      };
      StylableCardElementContainer.prototype.applyPadding = function () {
          _super.prototype.applyPadding.call(this);
          if (!this.renderedElement) {
              return;
          }
          var physicalPadding = new shared.SpacingDefinition();
          if (this.getEffectivePadding()) {
              physicalPadding = this.hostConfig.paddingDefinitionToSpacingDefinition(this.getEffectivePadding());
          }
          this.renderedElement.style.paddingTop = physicalPadding.top + "px";
          this.renderedElement.style.paddingRight = physicalPadding.right + "px";
          this.renderedElement.style.paddingBottom = physicalPadding.bottom + "px";
          this.renderedElement.style.paddingLeft = physicalPadding.left + "px";
          if (this.isBleeding()) {
              // Bleed into the first parent that does have padding
              var padding = new shared.PaddingDefinition();
              this.getImmediateSurroundingPadding(padding);
              var surroundingPadding = this.hostConfig.paddingDefinitionToSpacingDefinition(padding);
              this.renderedElement.style.marginRight = "-" + surroundingPadding.right + "px";
              this.renderedElement.style.marginLeft = "-" + surroundingPadding.left + "px";
              if (!this.isDesignMode()) {
                  this.renderedElement.style.marginTop = "-" + surroundingPadding.top + "px";
                  this.renderedElement.style.marginBottom = "-" + surroundingPadding.bottom + "px";
              }
              if (this.separatorElement && this.separatorOrientation == enums.Orientation.Horizontal) {
                  this.separatorElement.style.marginLeft = "-" + surroundingPadding.left + "px";
                  this.separatorElement.style.marginRight = "-" + surroundingPadding.right + "px";
              }
          }
          else {
              this.renderedElement.style.marginRight = "0";
              this.renderedElement.style.marginLeft = "0";
              this.renderedElement.style.marginTop = "0";
              this.renderedElement.style.marginBottom = "0";
              if (this.separatorElement) {
                  this.separatorElement.style.marginRight = "0";
                  this.separatorElement.style.marginLeft = "0";
              }
          }
      };
      StylableCardElementContainer.prototype.getHasBackground = function () {
          var currentElement = this.parent;
          while (currentElement) {
              var currentElementHasBackgroundImage = currentElement instanceof Container ? currentElement.backgroundImage.isValid() : false;
              if (currentElement instanceof StylableCardElementContainer) {
                  if (this.hasExplicitStyle && (currentElement.getEffectiveStyle() != this.getEffectiveStyle() || currentElementHasBackgroundImage)) {
                      return true;
                  }
              }
              currentElement = currentElement.parent;
          }
          return false;
      };
      StylableCardElementContainer.prototype.getDefaultPadding = function () {
          return this.getHasBackground() ?
              new shared.PaddingDefinition(enums.Spacing.Padding, enums.Spacing.Padding, enums.Spacing.Padding, enums.Spacing.Padding) : _super.prototype.getDefaultPadding.call(this);
      };
      StylableCardElementContainer.prototype.getHasExpandedAction = function () {
          return false;
      };
      StylableCardElementContainer.prototype.getBleed = function () {
          return this._bleed;
      };
      StylableCardElementContainer.prototype.setBleed = function (value) {
          this._bleed = value;
      };
      Object.defineProperty(StylableCardElementContainer.prototype, "renderedActionCount", {
          get: function () {
              return 0;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(StylableCardElementContainer.prototype, "hasExplicitStyle", {
          get: function () {
              return this._style != null;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(StylableCardElementContainer.prototype, "allowCustomStyle", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(StylableCardElementContainer.prototype, "supportsMinHeight", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      StylableCardElementContainer.prototype.isBleeding = function () {
          return this.getHasBackground() && this.getBleed();
      };
      StylableCardElementContainer.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "style", this.style);
          return result;
      };
      StylableCardElementContainer.prototype.internalValidateProperties = function (context) {
          _super.prototype.internalValidateProperties.call(this, context);
          if (this._style) {
              var styleDefinition = this.hostConfig.containerStyles.getStyleByName(this._style);
              if (!styleDefinition) {
                  context.addFailure(this, {
                      error: enums.ValidationError.InvalidPropertyValue,
                      message: "Unknown container style: " + this._style
                  });
              }
          }
      };
      StylableCardElementContainer.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this._style = utils.getStringValue(json["style"]);
      };
      StylableCardElementContainer.prototype.render = function () {
          var renderedElement = _super.prototype.render.call(this);
          if (renderedElement && this.getHasBackground()) {
              this.applyBackground();
          }
          return renderedElement;
      };
      StylableCardElementContainer.prototype.getEffectiveStyle = function () {
          var effectiveStyle = this.style;
          return effectiveStyle ? effectiveStyle : _super.prototype.getEffectiveStyle.call(this);
      };
      Object.defineProperty(StylableCardElementContainer.prototype, "style", {
          get: function () {
              if (this.allowCustomStyle) {
                  if (this._style && this.hostConfig.containerStyles.getStyleByName(this._style)) {
                      return this._style;
                  }
              }
              return null;
          },
          set: function (value) {
              this._style = value;
          },
          enumerable: true,
          configurable: true
      });
      return StylableCardElementContainer;
  }(CardElementContainer));
  exports.StylableCardElementContainer = StylableCardElementContainer;
  var BackgroundImage = /** @class */ (function () {
      function BackgroundImage() {
          this.fillMode = BackgroundImage.defaultFillMode;
          this.horizontalAlignment = BackgroundImage.defaultHorizontalAlignment;
          this.verticalAlignment = BackgroundImage.defaultVerticalAlignment;
      }
      BackgroundImage.prototype.reset = function () {
          this.url = undefined;
          this.fillMode = BackgroundImage.defaultFillMode;
          this.horizontalAlignment = BackgroundImage.defaultHorizontalAlignment;
          this.verticalAlignment = BackgroundImage.defaultVerticalAlignment;
      };
      BackgroundImage.prototype.parse = function (json, errors) {
          this.url = utils.getStringValue(json["url"]);
          this.fillMode = utils.getEnumValue(enums.FillMode, json["fillMode"], this.fillMode);
          this.horizontalAlignment = utils.getEnumValue(enums.HorizontalAlignment, json["horizontalAlignment"], this.horizontalAlignment);
          this.verticalAlignment = utils.getEnumValue(enums.VerticalAlignment, json["verticalAlignment"], this.verticalAlignment);
      };
      BackgroundImage.prototype.toJSON = function () {
          if (!this.isValid()) {
              return null;
          }
          if (this.fillMode == BackgroundImage.defaultFillMode &&
              this.horizontalAlignment == BackgroundImage.defaultHorizontalAlignment &&
              this.verticalAlignment == BackgroundImage.defaultVerticalAlignment) {
              return this.url;
          }
          else {
              var result = {};
              utils.setProperty(result, "url", this.url);
              utils.setEnumProperty(enums.FillMode, result, "fillMode", this.fillMode, BackgroundImage.defaultFillMode);
              utils.setEnumProperty(enums.HorizontalAlignment, result, "horizontalAlignment", this.horizontalAlignment, BackgroundImage.defaultHorizontalAlignment);
              utils.setEnumProperty(enums.VerticalAlignment, result, "verticalAlignment", this.verticalAlignment, BackgroundImage.defaultVerticalAlignment);
              return result;
          }
      };
      BackgroundImage.prototype.apply = function (element) {
          if (this.url) {
              element.style.backgroundImage = "url('" + this.url + "')";
              switch (this.fillMode) {
                  case enums.FillMode.Repeat:
                      element.style.backgroundRepeat = "repeat";
                      break;
                  case enums.FillMode.RepeatHorizontally:
                      element.style.backgroundRepeat = "repeat-x";
                      break;
                  case enums.FillMode.RepeatVertically:
                      element.style.backgroundRepeat = "repeat-y";
                      break;
                  case enums.FillMode.Cover:
                  default:
                      element.style.backgroundRepeat = "no-repeat";
                      element.style.backgroundSize = "cover";
                      break;
              }
              switch (this.horizontalAlignment) {
                  case enums.HorizontalAlignment.Center:
                      element.style.backgroundPositionX = "center";
                      break;
                  case enums.HorizontalAlignment.Right:
                      element.style.backgroundPositionX = "right";
                      break;
              }
              switch (this.verticalAlignment) {
                  case enums.VerticalAlignment.Center:
                      element.style.backgroundPositionY = "center";
                      break;
                  case enums.VerticalAlignment.Bottom:
                      element.style.backgroundPositionY = "bottom";
                      break;
              }
          }
      };
      BackgroundImage.prototype.isValid = function () {
          return !utils.isNullOrEmpty(this.url);
      };
      BackgroundImage.defaultFillMode = enums.FillMode.Cover;
      BackgroundImage.defaultHorizontalAlignment = enums.HorizontalAlignment.Left;
      BackgroundImage.defaultVerticalAlignment = enums.VerticalAlignment.Top;
      return BackgroundImage;
  }());
  exports.BackgroundImage = BackgroundImage;
  var Container = /** @class */ (function (_super) {
      __extends(Container, _super);
      function Container() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._items = [];
          _this._renderedItems = [];
          _this.backgroundImage = new BackgroundImage();
          _this.verticalContentAlignment = enums.VerticalAlignment.Top;
          _this.rtl = null;
          return _this;
      }
      Container.prototype.insertItemAt = function (item, index, forceInsert) {
          if (!item.parent || forceInsert) {
              if (item.isStandalone) {
                  if (index < 0 || index >= this._items.length) {
                      this._items.push(item);
                  }
                  else {
                      this._items.splice(index, 0, item);
                  }
                  item.setParent(this);
              }
              else {
                  throw new Error("Elements of type " + item.getJsonTypeName() + " cannot be used as standalone elements.");
              }
          }
          else {
              throw new Error("The element already belongs to another container.");
          }
      };
      Container.prototype.supportsExcplitiHeight = function () {
          return true;
      };
      Container.prototype.getItemsCollectionPropertyName = function () {
          return "items";
      };
      Container.prototype.applyBackground = function () {
          if (this.backgroundImage.isValid()) {
              this.backgroundImage.apply(this.renderedElement);
          }
          _super.prototype.applyBackground.call(this);
      };
      Container.prototype.internalRender = function () {
          this._renderedItems = [];
          // Cache hostConfig to avoid walking the parent hierarchy several times
          var hostConfig = this.hostConfig;
          var element = document.createElement("div");
          if (this.rtl != null && this.rtl) {
              element.dir = "rtl";
          }
          element.classList.add(hostConfig.makeCssClassName("ac-container"));
          element.style.display = "flex";
          element.style.flexDirection = "column";
          if (AdaptiveCard.useAdvancedCardBottomTruncation) {
              // Forces the container to be at least as tall as its content.
              //
              // Fixes a quirk in Chrome where, for nested flex elements, the
              // inner element's height would never exceed the outer element's
              // height. This caused overflow truncation to break -- containers
              // would always be measured as not overflowing, since their heights
              // were constrained by their parents as opposed to truly reflecting
              // the height of their content.
              //
              // See the "Browser Rendering Notes" section of this answer:
              // https://stackoverflow.com/questions/36247140/why-doesnt-flex-item-shrink-past-content-size
              element.style.minHeight = '-webkit-min-content';
          }
          switch (this.verticalContentAlignment) {
              case enums.VerticalAlignment.Center:
                  element.style.justifyContent = "center";
                  break;
              case enums.VerticalAlignment.Bottom:
                  element.style.justifyContent = "flex-end";
                  break;
              default:
                  element.style.justifyContent = "flex-start";
                  break;
          }
          if (this._items.length > 0) {
              for (var i = 0; i < this._items.length; i++) {
                  var renderedElement = this.isElementAllowed(this._items[i], this.getForbiddenElementTypes()) ? this._items[i].render() : null;
                  if (renderedElement) {
                      if (this._renderedItems.length > 0 && this._items[i].separatorElement) {
                          this._items[i].separatorElement.style.flex = "0 0 auto";
                          utils.appendChild(element, this._items[i].separatorElement);
                      }
                      utils.appendChild(element, renderedElement);
                      this._renderedItems.push(this._items[i]);
                  }
              }
          }
          else {
              if (this.isDesignMode()) {
                  var placeholderElement = this.createPlaceholderElement();
                  placeholderElement.style.width = "100%";
                  placeholderElement.style.height = "100%";
                  element.appendChild(placeholderElement);
              }
          }
          return element;
      };
      Container.prototype.truncateOverflow = function (maxHeight) {
          // Add 1 to account for rounding differences between browsers
          var boundary = this.renderedElement.offsetTop + maxHeight + 1;
          var handleElement = function (cardElement) {
              var elt = cardElement.renderedElement;
              if (elt) {
                  switch (utils.getFitStatus(elt, boundary)) {
                      case enums.ContainerFitStatus.FullyInContainer:
                          var sizeChanged = cardElement['resetOverflow']();
                          // If the element's size changed after resetting content,
                          // we have to check if it still fits fully in the card
                          if (sizeChanged) {
                              handleElement(cardElement);
                          }
                          break;
                      case enums.ContainerFitStatus.Overflowing:
                          var maxHeight_1 = boundary - elt.offsetTop;
                          cardElement['handleOverflow'](maxHeight_1);
                          break;
                      case enums.ContainerFitStatus.FullyOutOfContainer:
                          cardElement['handleOverflow'](0);
                          break;
                  }
              }
          };
          for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
              var item = _a[_i];
              handleElement(item);
          }
          return true;
      };
      Container.prototype.undoOverflowTruncation = function () {
          for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
              var item = _a[_i];
              item['resetOverflow']();
          }
      };
      Container.prototype.getHasBackground = function () {
          return this.backgroundImage.isValid() || _super.prototype.getHasBackground.call(this);
      };
      Object.defineProperty(Container.prototype, "isSelectable", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      Container.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "backgroundImage", this.backgroundImage.toJSON());
          utils.setEnumProperty(enums.VerticalAlignment, result, "verticalContentAlignment", this.verticalContentAlignment, enums.VerticalAlignment.Top);
          if (this._items.length > 0) {
              var elements = [];
              for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                  var element = _a[_i];
                  elements.push(element.toJSON());
              }
              utils.setProperty(result, this.getItemsCollectionPropertyName(), elements);
          }
          utils.setProperty(result, "bleed", this.bleed, false);
          return result;
      };
      Container.prototype.getItemCount = function () {
          return this._items.length;
      };
      Container.prototype.getItemAt = function (index) {
          return this._items[index];
      };
      Container.prototype.getFirstVisibleRenderedItem = function () {
          if (this.renderedElement && this._renderedItems && this._renderedItems.length > 0) {
              for (var _i = 0, _a = this._renderedItems; _i < _a.length; _i++) {
                  var item = _a[_i];
                  if (item.isVisible) {
                      return item;
                  }
              }
          }
          return null;
      };
      Container.prototype.getLastVisibleRenderedItem = function () {
          if (this.renderedElement && this._renderedItems && this._renderedItems.length > 0) {
              for (var i = this._renderedItems.length - 1; i >= 0; i--) {
                  if (this._renderedItems[i].isVisible) {
                      return this._renderedItems[i];
                  }
              }
          }
          return null;
      };
      Container.prototype.getJsonTypeName = function () {
          return "Container";
      };
      Container.prototype.isFirstElement = function (element) {
          var designMode = this.isDesignMode();
          for (var i = 0; i < this._items.length; i++) {
              if (this._items[i].isVisible || designMode) {
                  return this._items[i] == element;
              }
          }
          return false;
      };
      Container.prototype.isLastElement = function (element) {
          var designMode = this.isDesignMode();
          for (var i = this._items.length - 1; i >= 0; i--) {
              if (this._items[i].isVisible || designMode) {
                  return this._items[i] == element;
              }
          }
          return false;
      };
      Container.prototype.isRtl = function () {
          if (this.rtl != null) {
              return this.rtl;
          }
          else {
              var parentContainer = this.getParentContainer();
              return parentContainer ? parentContainer.isRtl() : false;
          }
      };
      Container.prototype.isBleedingAtTop = function () {
          var firstRenderedItem = this.getFirstVisibleRenderedItem();
          return this.isBleeding() || (firstRenderedItem ? firstRenderedItem.isBleedingAtTop() : false);
      };
      Container.prototype.isBleedingAtBottom = function () {
          var lastRenderedItem = this.getLastVisibleRenderedItem();
          return this.isBleeding() || (lastRenderedItem ? lastRenderedItem.isBleedingAtBottom() && lastRenderedItem.getEffectiveStyle() == this.getEffectiveStyle() : false);
      };
      Container.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this.setShouldFallback(false);
          this._items = [];
          this._renderedItems = [];
          this.backgroundImage.reset();
          var jsonBackgroundImage = json["backgroundImage"];
          if (jsonBackgroundImage) {
              if (typeof jsonBackgroundImage === "string") {
                  this.backgroundImage.url = jsonBackgroundImage;
                  this.backgroundImage.fillMode = enums.FillMode.Cover;
              }
              else if (typeof jsonBackgroundImage === "object") {
                  this.backgroundImage.parse(jsonBackgroundImage, errors);
              }
          }
          this.verticalContentAlignment = utils.getEnumValue(enums.VerticalAlignment, json["verticalContentAlignment"], this.verticalContentAlignment);
          if (json[this.getItemsCollectionPropertyName()] != null) {
              var items = json[this.getItemsCollectionPropertyName()];
              this.clear();
              for (var i = 0; i < items.length; i++) {
                  var element = createElementInstance(this, items[i], !this.isDesignMode(), errors);
                  if (element) {
                      this.insertItemAt(element, -1, true);
                  }
              }
          }
          this.bleed = utils.getBoolValue(json["bleed"], this.bleed);
      };
      Container.prototype.indexOf = function (cardElement) {
          return this._items.indexOf(cardElement);
      };
      Container.prototype.addItem = function (item) {
          this.insertItemAt(item, -1, false);
      };
      Container.prototype.insertItemBefore = function (item, insertBefore) {
          this.insertItemAt(item, this._items.indexOf(insertBefore), false);
      };
      Container.prototype.insertItemAfter = function (item, insertAfter) {
          this.insertItemAt(item, this._items.indexOf(insertAfter) + 1, false);
      };
      Container.prototype.removeItem = function (item) {
          var itemIndex = this._items.indexOf(item);
          if (itemIndex >= 0) {
              this._items.splice(itemIndex, 1);
              item.setParent(null);
              this.updateLayout();
              return true;
          }
          return false;
      };
      Container.prototype.clear = function () {
          this._items = [];
      };
      Container.prototype.getResourceInformation = function () {
          var result = _super.prototype.getResourceInformation.call(this);
          if (this.backgroundImage.isValid()) {
              result.push({ url: this.backgroundImage.url, mimeType: "image" });
          }
          return result;
      };
      Container.prototype.getActionById = function (id) {
          var result = _super.prototype.getActionById.call(this, id);
          if (!result) {
              if (this.selectAction) {
                  result = this.selectAction.getActionById(id);
              }
              if (!result) {
                  for (var i = 0; i < this._items.length; i++) {
                      result = this._items[i].getActionById(id);
                      if (result) {
                          break;
                      }
                  }
              }
          }
          return result;
      };
      Object.defineProperty(Container.prototype, "padding", {
          get: function () {
              return this.getPadding();
          },
          set: function (value) {
              this.setPadding(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Container.prototype, "selectAction", {
          get: function () {
              return this.getSelectAction();
          },
          set: function (value) {
              this.setSelectAction(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Container.prototype, "bleed", {
          get: function () {
              return this.getBleed();
          },
          set: function (value) {
              this.setBleed(value);
          },
          enumerable: true,
          configurable: true
      });
      return Container;
  }(StylableCardElementContainer));
  exports.Container = Container;
  var Column = /** @class */ (function (_super) {
      __extends(Column, _super);
      function Column(width) {
          if (width === void 0) { width = "auto"; }
          var _this = _super.call(this) || this;
          _this._computedWeight = 0;
          _this.width = "auto";
          _this.width = width;
          return _this;
      }
      Column.prototype.adjustRenderedElementSize = function (renderedElement) {
          var minDesignTimeColumnHeight = 20;
          if (this.isDesignMode()) {
              renderedElement.style.minWidth = "20px";
              renderedElement.style.minHeight = (!this.minPixelHeight ? minDesignTimeColumnHeight : Math.max(this.minPixelHeight, minDesignTimeColumnHeight)) + "px";
          }
          else {
              renderedElement.style.minWidth = "0";
              if (this.minPixelHeight) {
                  renderedElement.style.minHeight = this.minPixelHeight + "px";
              }
          }
          if (this.width === "auto") {
              renderedElement.style.flex = "0 1 auto";
          }
          else if (this.width === "stretch") {
              renderedElement.style.flex = "1 1 50px";
          }
          else {
              var sizeAndUnit = this.width;
              if (sizeAndUnit.unit == enums.SizeUnit.Pixel) {
                  renderedElement.style.flex = "0 0 auto";
                  renderedElement.style.width = sizeAndUnit.physicalSize + "px";
              }
              else {
                  renderedElement.style.flex = "1 1 " + (this._computedWeight > 0 ? this._computedWeight : sizeAndUnit.physicalSize) + "%";
              }
          }
      };
      Object.defineProperty(Column.prototype, "separatorOrientation", {
          get: function () {
              return enums.Orientation.Vertical;
          },
          enumerable: true,
          configurable: true
      });
      Column.prototype.getJsonTypeName = function () {
          return "Column";
      };
      Column.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          if (this.width instanceof shared.SizeAndUnit) {
              if (this.width.unit == enums.SizeUnit.Pixel) {
                  utils.setProperty(result, "width", this.width.physicalSize + "px");
              }
              else {
                  utils.setProperty(result, "width", this.width.physicalSize);
              }
          }
          else {
              utils.setProperty(result, "width", this.width);
          }
          return result;
      };
      Column.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          var jsonWidth = json["width"];
          if (jsonWidth === undefined) {
              jsonWidth = json["size"];
              if (jsonWidth !== undefined) {
                  raiseParseError({
                      error: enums.ValidationError.Deprecated,
                      message: "The \"Column.size\" property is deprecated and will be removed. Use the \"Column.width\" property instead."
                  }, errors);
              }
          }
          var invalidWidth = false;
          try {
              this.width = shared.SizeAndUnit.parse(jsonWidth);
          }
          catch (e) {
              if (typeof jsonWidth === "string" && (jsonWidth === "auto" || jsonWidth === "stretch")) {
                  this.width = jsonWidth;
              }
              else {
                  invalidWidth = true;
              }
          }
          if (invalidWidth) {
              raiseParseError({
                  error: enums.ValidationError.InvalidPropertyValue,
                  message: "Invalid column width:" + jsonWidth + " - defaulting to \"auto\""
              }, errors);
          }
      };
      Object.defineProperty(Column.prototype, "hasVisibleSeparator", {
          get: function () {
              if (this.parent && this.parent instanceof ColumnSet) {
                  return this.separatorElement && !this.parent.isLeftMostElement(this);
              }
              else {
                  return false;
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Column.prototype, "isStandalone", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      return Column;
  }(Container));
  exports.Column = Column;
  var ColumnSet = /** @class */ (function (_super) {
      __extends(ColumnSet, _super);
      function ColumnSet() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._columns = [];
          return _this;
      }
      ColumnSet.prototype.createColumnInstance = function (json, errors) {
          return createCardObjectInstance(this, json, [], // Forbidden types not supported for elements for now
          !this.isDesignMode(), function (typeName) {
              return !typeName || typeName === "Column" ? new Column() : null;
          }, function (typeName, errorType) {
              if (errorType == InstanceCreationErrorType.UnknownType) {
                  return {
                      error: enums.ValidationError.UnknownElementType,
                      message: "Unknown element type: " + typeName + ". Fallback will be used if present."
                  };
              }
              else {
                  return {
                      error: enums.ValidationError.ElementTypeNotAllowed,
                      message: "Element type " + typeName + " isn't allowed in a ColumnSet."
                  };
              }
          }, errors);
      };
      ColumnSet.prototype.internalRender = function () {
          this._renderedColumns = [];
          if (this._columns.length > 0) {
              // Cache hostConfig to avoid walking the parent hierarchy several times
              var hostConfig = this.hostConfig;
              var element = document.createElement("div");
              element.className = hostConfig.makeCssClassName("ac-columnSet");
              element.style.display = "flex";
              if (AdaptiveCard.useAdvancedCardBottomTruncation) {
                  // See comment in Container.internalRender()
                  element.style.minHeight = '-webkit-min-content';
              }
              switch (this.horizontalAlignment) {
                  case enums.HorizontalAlignment.Center:
                      element.style.justifyContent = "center";
                      break;
                  case enums.HorizontalAlignment.Right:
                      element.style.justifyContent = "flex-end";
                      break;
                  default:
                      element.style.justifyContent = "flex-start";
                      break;
              }
              var totalWeight = 0;
              for (var _i = 0, _a = this._columns; _i < _a.length; _i++) {
                  var column = _a[_i];
                  if (column.width instanceof shared.SizeAndUnit && (column.width.unit == enums.SizeUnit.Weight)) {
                      totalWeight += column.width.physicalSize;
                  }
              }
              for (var _b = 0, _c = this._columns; _b < _c.length; _b++) {
                  var column = _c[_b];
                  if (column.width instanceof shared.SizeAndUnit && column.width.unit == enums.SizeUnit.Weight && totalWeight > 0) {
                      var computedWeight = 100 / totalWeight * column.width.physicalSize;
                      // Best way to emulate "internal" access I know of
                      column["_computedWeight"] = computedWeight;
                  }
                  var renderedColumn = column.render();
                  if (renderedColumn) {
                      if (this._renderedColumns.length > 0 && column.separatorElement) {
                          column.separatorElement.style.flex = "0 0 auto";
                          utils.appendChild(element, column.separatorElement);
                      }
                      utils.appendChild(element, renderedColumn);
                      this._renderedColumns.push(column);
                  }
              }
              return this._renderedColumns.length > 0 ? element : null;
          }
          else {
              return null;
          }
      };
      ColumnSet.prototype.truncateOverflow = function (maxHeight) {
          for (var _i = 0, _a = this._columns; _i < _a.length; _i++) {
              var column = _a[_i];
              column['handleOverflow'](maxHeight);
          }
          return true;
      };
      ColumnSet.prototype.undoOverflowTruncation = function () {
          for (var _i = 0, _a = this._columns; _i < _a.length; _i++) {
              var column = _a[_i];
              column['resetOverflow']();
          }
      };
      Object.defineProperty(ColumnSet.prototype, "isSelectable", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      ColumnSet.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          if (this._columns.length > 0) {
              var columns = [];
              for (var _i = 0, _a = this._columns; _i < _a.length; _i++) {
                  var column = _a[_i];
                  columns.push(column.toJSON());
              }
              utils.setProperty(result, "columns", columns);
          }
          utils.setProperty(result, "bleed", this.bleed, false);
          return result;
      };
      ColumnSet.prototype.isFirstElement = function (element) {
          for (var i = 0; i < this._columns.length; i++) {
              if (this._columns[i].isVisible) {
                  return this._columns[i] == element;
              }
          }
          return false;
      };
      ColumnSet.prototype.isBleedingAtTop = function () {
          if (this.isBleeding()) {
              return true;
          }
          if (this._renderedColumns && this._renderedColumns.length > 0) {
              for (var _i = 0, _a = this._columns; _i < _a.length; _i++) {
                  var column = _a[_i];
                  if (column.isBleedingAtTop()) {
                      return true;
                  }
              }
          }
          return false;
      };
      ColumnSet.prototype.isBleedingAtBottom = function () {
          if (this.isBleeding()) {
              return true;
          }
          if (this._renderedColumns && this._renderedColumns.length > 0) {
              for (var _i = 0, _a = this._columns; _i < _a.length; _i++) {
                  var column = _a[_i];
                  if (column.isBleedingAtBottom()) {
                      return true;
                  }
              }
          }
          return false;
      };
      ColumnSet.prototype.getCount = function () {
          return this._columns.length;
      };
      ColumnSet.prototype.getItemCount = function () {
          return this.getCount();
      };
      ColumnSet.prototype.getFirstVisibleRenderedItem = function () {
          if (this.renderedElement && this._renderedColumns && this._renderedColumns.length > 0) {
              return this._renderedColumns[0];
          }
          else {
              return null;
          }
      };
      ColumnSet.prototype.getLastVisibleRenderedItem = function () {
          if (this.renderedElement && this._renderedColumns && this._renderedColumns.length > 0) {
              return this._renderedColumns[this._renderedColumns.length - 1];
          }
          else {
              return null;
          }
      };
      ColumnSet.prototype.getColumnAt = function (index) {
          return this._columns[index];
      };
      ColumnSet.prototype.getItemAt = function (index) {
          return this.getColumnAt(index);
      };
      ColumnSet.prototype.getJsonTypeName = function () {
          return "ColumnSet";
      };
      ColumnSet.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          if (json["columns"] != null) {
              var jsonColumns = json["columns"];
              this._columns = [];
              for (var i = 0; i < jsonColumns.length; i++) {
                  var column = this.createColumnInstance(jsonColumns[i], errors);
                  this._columns.push(column);
              }
          }
          this.bleed = utils.getBoolValue(json["bleed"], this.bleed);
      };
      ColumnSet.prototype.internalValidateProperties = function (context) {
          _super.prototype.internalValidateProperties.call(this, context);
          var weightedColumns = 0;
          var stretchedColumns = 0;
          for (var _i = 0, _a = this._columns; _i < _a.length; _i++) {
              var column = _a[_i];
              if (typeof column.width === "number") {
                  weightedColumns++;
              }
              else if (column.width === "stretch") {
                  stretchedColumns++;
              }
          }
          if (weightedColumns > 0 && stretchedColumns > 0) {
              context.addFailure(this, {
                  error: enums.ValidationError.Hint,
                  message: "It is not recommended to use weighted and stretched columns in the same ColumnSet, because in such a situation stretched columns will always get the minimum amount of space."
              });
          }
      };
      ColumnSet.prototype.addColumn = function (column) {
          if (!column.parent) {
              this._columns.push(column);
              column.setParent(this);
          }
          else {
              throw new Error("This column already belongs to another ColumnSet.");
          }
      };
      ColumnSet.prototype.removeItem = function (item) {
          if (item instanceof Column) {
              var itemIndex = this._columns.indexOf(item);
              if (itemIndex >= 0) {
                  this._columns.splice(itemIndex, 1);
                  item.setParent(null);
                  this.updateLayout();
                  return true;
              }
          }
          return false;
      };
      ColumnSet.prototype.indexOf = function (cardElement) {
          return cardElement instanceof Column ? this._columns.indexOf(cardElement) : -1;
      };
      ColumnSet.prototype.isLeftMostElement = function (element) {
          return this._columns.indexOf(element) == 0;
      };
      ColumnSet.prototype.isRightMostElement = function (element) {
          return this._columns.indexOf(element) == this._columns.length - 1;
      };
      ColumnSet.prototype.isTopElement = function (element) {
          return this._columns.indexOf(element) >= 0;
      };
      ColumnSet.prototype.isBottomElement = function (element) {
          return this._columns.indexOf(element) >= 0;
      };
      ColumnSet.prototype.getActionById = function (id) {
          var result = null;
          for (var i = 0; i < this._columns.length; i++) {
              result = this._columns[i].getActionById(id);
              if (result) {
                  break;
              }
          }
          return result;
      };
      Object.defineProperty(ColumnSet.prototype, "bleed", {
          get: function () {
              return this.getBleed();
          },
          set: function (value) {
              this.setBleed(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ColumnSet.prototype, "padding", {
          get: function () {
              return this.getPadding();
          },
          set: function (value) {
              this.setPadding(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ColumnSet.prototype, "selectAction", {
          get: function () {
              return this.getSelectAction();
          },
          set: function (value) {
              this.setSelectAction(value);
          },
          enumerable: true,
          configurable: true
      });
      return ColumnSet;
  }(StylableCardElementContainer));
  exports.ColumnSet = ColumnSet;
  function raiseImageLoadedEvent(image) {
      var card = image.getRootElement();
      var onImageLoadedHandler = (card && card.onImageLoaded) ? card.onImageLoaded : AdaptiveCard.onImageLoaded;
      if (onImageLoadedHandler) {
          onImageLoadedHandler(image);
      }
  }
  function raiseAnchorClickedEvent(element, anchor) {
      var card = element.getRootElement();
      var onAnchorClickedHandler = (card && card.onAnchorClicked) ? card.onAnchorClicked : AdaptiveCard.onAnchorClicked;
      return onAnchorClickedHandler != null ? onAnchorClickedHandler(element, anchor) : false;
  }
  function raiseExecuteActionEvent(action) {
      var card = action.parent.getRootElement();
      var onExecuteActionHandler = (card && card.onExecuteAction) ? card.onExecuteAction : AdaptiveCard.onExecuteAction;
      if (onExecuteActionHandler) {
          if (action.prepareForExecution()) {
              onExecuteActionHandler(action);
          }
      }
  }
  function raiseInlineCardExpandedEvent(action, isExpanded) {
      var card = action.parent.getRootElement();
      var onInlineCardExpandedHandler = (card && card.onInlineCardExpanded) ? card.onInlineCardExpanded : AdaptiveCard.onInlineCardExpanded;
      if (onInlineCardExpandedHandler) {
          onInlineCardExpandedHandler(action, isExpanded);
      }
  }
  function raiseInputValueChangedEvent(input) {
      var card = input.getRootElement();
      var onInputValueChangedHandler = (card && card.onInputValueChanged) ? card.onInputValueChanged : AdaptiveCard.onInputValueChanged;
      if (onInputValueChangedHandler) {
          onInputValueChangedHandler(input);
      }
  }
  function raiseElementVisibilityChangedEvent(element, shouldUpdateLayout) {
      if (shouldUpdateLayout === void 0) { shouldUpdateLayout = true; }
      var rootElement = element.getRootElement();
      if (shouldUpdateLayout) {
          rootElement.updateLayout();
      }
      var card = rootElement;
      var onElementVisibilityChangedHandler = (card && card.onElementVisibilityChanged) ? card.onElementVisibilityChanged : AdaptiveCard.onElementVisibilityChanged;
      if (onElementVisibilityChangedHandler != null) {
          onElementVisibilityChangedHandler(element);
      }
  }
  function raiseParseElementEvent(element, json, errors) {
      var card = element.getRootElement();
      var onParseElementHandler = (card && card.onParseElement) ? card.onParseElement : AdaptiveCard.onParseElement;
      if (onParseElementHandler != null) {
          onParseElementHandler(element, json, errors);
      }
  }
  function raiseParseActionEvent(action, json, errors) {
      var card = action.parent ? action.parent.getRootElement() : null;
      var onParseActionHandler = (card && card.onParseAction) ? card.onParseAction : AdaptiveCard.onParseAction;
      if (onParseActionHandler != null) {
          onParseActionHandler(action, json, errors);
      }
  }
  function raiseParseError(error, errors) {
      if (errors) {
          errors.push(error);
      }
      if (AdaptiveCard.onParseError != null) {
          AdaptiveCard.onParseError(error);
      }
  }
  var ContainerWithActions = /** @class */ (function (_super) {
      __extends(ContainerWithActions, _super);
      function ContainerWithActions() {
          var _this = _super.call(this) || this;
          _this._actionCollection = new ActionCollection(_this);
          return _this;
      }
      ContainerWithActions.prototype.internalRender = function () {
          var element = _super.prototype.internalRender.call(this);
          var renderedActions = this._actionCollection.render(this.hostConfig.actions.actionsOrientation, false);
          if (renderedActions) {
              utils.appendChild(element, utils.renderSeparation(this.hostConfig, {
                  spacing: this.hostConfig.getEffectiveSpacing(this.hostConfig.actions.spacing),
                  lineThickness: null,
                  lineColor: null
              }, enums.Orientation.Horizontal));
              utils.appendChild(element, renderedActions);
          }
          if (this.renderIfEmpty) {
              return element;
          }
          else {
              return element.children.length > 0 ? element : null;
          }
      };
      ContainerWithActions.prototype.getHasExpandedAction = function () {
          if (this.renderedActionCount == 0) {
              return false;
          }
          else if (this.renderedActionCount == 1) {
              return this._actionCollection.expandedAction != null && !this.hostConfig.actions.preExpandSingleShowCardAction;
          }
          else {
              return this._actionCollection.expandedAction != null;
          }
      };
      Object.defineProperty(ContainerWithActions.prototype, "renderedActionCount", {
          get: function () {
              return this._actionCollection.renderedActionCount;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ContainerWithActions.prototype, "renderIfEmpty", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      ContainerWithActions.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "actions", this._actionCollection.toJSON());
          return result;
      };
      ContainerWithActions.prototype.getActionCount = function () {
          return this._actionCollection.items.length;
      };
      ContainerWithActions.prototype.getActionAt = function (index) {
          if (index >= 0 && index < this.getActionCount()) {
              return this._actionCollection.items[index];
          }
          else {
              _super.prototype.getActionAt.call(this, index);
          }
      };
      ContainerWithActions.prototype.getActionById = function (id) {
          var result = this._actionCollection.getActionById(id);
          return result ? result : _super.prototype.getActionById.call(this, id);
      };
      ContainerWithActions.prototype.parse = function (json, errors) {
          _super.prototype.parse.call(this, json, errors);
          this._actionCollection.parse(json["actions"], errors);
      };
      ContainerWithActions.prototype.internalValidateProperties = function (context) {
          _super.prototype.internalValidateProperties.call(this, context);
          if (this._actionCollection) {
              this._actionCollection.validateProperties(context);
          }
      };
      ContainerWithActions.prototype.isLastElement = function (element) {
          return _super.prototype.isLastElement.call(this, element) && this._actionCollection.items.length == 0;
      };
      ContainerWithActions.prototype.addAction = function (action) {
          this._actionCollection.addAction(action);
      };
      ContainerWithActions.prototype.clear = function () {
          _super.prototype.clear.call(this);
          this._actionCollection.clear();
      };
      ContainerWithActions.prototype.getAllInputs = function () {
          return _super.prototype.getAllInputs.call(this).concat(this._actionCollection.getAllInputs());
      };
      ContainerWithActions.prototype.getResourceInformation = function () {
          return _super.prototype.getResourceInformation.call(this).concat(this._actionCollection.getResourceInformation());
      };
      ContainerWithActions.prototype.isBleedingAtBottom = function () {
          if (this._actionCollection.renderedActionCount == 0) {
              return _super.prototype.isBleedingAtBottom.call(this);
          }
          else {
              if (this._actionCollection.items.length == 1) {
                  return this._actionCollection.expandedAction != null && !this.hostConfig.actions.preExpandSingleShowCardAction;
              }
              else {
                  return this._actionCollection.expandedAction != null;
              }
          }
      };
      Object.defineProperty(ContainerWithActions.prototype, "isStandalone", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      return ContainerWithActions;
  }(Container));
  exports.ContainerWithActions = ContainerWithActions;
  var TypeRegistry = /** @class */ (function () {
      function TypeRegistry() {
          this._items = [];
          this.reset();
      }
      TypeRegistry.prototype.findTypeRegistration = function (typeName) {
          for (var i = 0; i < this._items.length; i++) {
              if (this._items[i].typeName === typeName) {
                  return this._items[i];
              }
          }
          return null;
      };
      TypeRegistry.prototype.clear = function () {
          this._items = [];
      };
      TypeRegistry.prototype.registerType = function (typeName, createInstance) {
          var registrationInfo = this.findTypeRegistration(typeName);
          if (registrationInfo != null) {
              registrationInfo.createInstance = createInstance;
          }
          else {
              registrationInfo = {
                  typeName: typeName,
                  createInstance: createInstance
              };
              this._items.push(registrationInfo);
          }
      };
      TypeRegistry.prototype.unregisterType = function (typeName) {
          for (var i = 0; i < this._items.length; i++) {
              if (this._items[i].typeName === typeName) {
                  this._items.splice(i, 1);
                  return;
              }
          }
      };
      TypeRegistry.prototype.createInstance = function (typeName) {
          var registrationInfo = this.findTypeRegistration(typeName);
          return registrationInfo ? registrationInfo.createInstance() : null;
      };
      TypeRegistry.prototype.getItemCount = function () {
          return this._items.length;
      };
      TypeRegistry.prototype.getItemAt = function (index) {
          return this._items[index];
      };
      return TypeRegistry;
  }());
  exports.TypeRegistry = TypeRegistry;
  var ElementTypeRegistry = /** @class */ (function (_super) {
      __extends(ElementTypeRegistry, _super);
      function ElementTypeRegistry() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      ElementTypeRegistry.prototype.reset = function () {
          this.clear();
          this.registerType("Container", function () { return new Container(); });
          this.registerType("TextBlock", function () { return new TextBlock(); });
          this.registerType("RichTextBlock", function () { return new RichTextBlock(); });
          this.registerType("TextRun", function () { return new TextRun(); });
          this.registerType("Image", function () { return new Image(); });
          this.registerType("ImageSet", function () { return new ImageSet(); });
          this.registerType("Media", function () { return new Media(); });
          this.registerType("FactSet", function () { return new FactSet(); });
          this.registerType("ColumnSet", function () { return new ColumnSet(); });
          this.registerType("ActionSet", function () { return new ActionSet(); });
          this.registerType("Input.Text", function () { return new TextInput(); });
          this.registerType("Input.Date", function () { return new DateInput(); });
          this.registerType("Input.Time", function () { return new TimeInput(); });
          this.registerType("Input.Number", function () { return new NumberInput(); });
          this.registerType("Input.ChoiceSet", function () { return new ChoiceSetInput(); });
          this.registerType("Input.Toggle", function () { return new ToggleInput(); });
      };
      return ElementTypeRegistry;
  }(TypeRegistry));
  exports.ElementTypeRegistry = ElementTypeRegistry;
  var ActionTypeRegistry = /** @class */ (function (_super) {
      __extends(ActionTypeRegistry, _super);
      function ActionTypeRegistry() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      ActionTypeRegistry.prototype.reset = function () {
          this.clear();
          this.registerType(OpenUrlAction.JsonTypeName, function () { return new OpenUrlAction(); });
          this.registerType(SubmitAction.JsonTypeName, function () { return new SubmitAction(); });
          this.registerType(ShowCardAction.JsonTypeName, function () { return new ShowCardAction(); });
          this.registerType(ToggleVisibilityAction.JsonTypeName, function () { return new ToggleVisibilityAction(); });
      };
      return ActionTypeRegistry;
  }(TypeRegistry));
  exports.ActionTypeRegistry = ActionTypeRegistry;
  var AdaptiveCard = /** @class */ (function (_super) {
      __extends(AdaptiveCard, _super);
      function AdaptiveCard() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._cardTypeName = "AdaptiveCard";
          _this._fallbackCard = null;
          _this.onAnchorClicked = null;
          _this.onExecuteAction = null;
          _this.onElementVisibilityChanged = null;
          _this.onImageLoaded = null;
          _this.onInlineCardExpanded = null;
          _this.onInputValueChanged = null;
          _this.onParseElement = null;
          _this.onParseAction = null;
          _this.version = new hostConfig.Version(1, 0);
          _this.designMode = false;
          return _this;
      }
      Object.defineProperty(AdaptiveCard, "processMarkdown", {
          get: function () {
              throw new Error("The processMarkdown event has been removed. Please update your code and set onProcessMarkdown instead.");
          },
          set: function (value) {
              throw new Error("The processMarkdown event has been removed. Please update your code and set onProcessMarkdown instead.");
          },
          enumerable: true,
          configurable: true
      });
      AdaptiveCard.applyMarkdown = function (text) {
          var result = {
              didProcess: false
          };
          if (AdaptiveCard.onProcessMarkdown) {
              AdaptiveCard.onProcessMarkdown(text, result);
          }
          else if (window["markdownit"]) {
              // Check for markdownit
              result.outputHtml = window["markdownit"]().render(text);
              result.didProcess = true;
          }
          else {
              console.warn("Markdown processing isn't enabled. Please see https://www.npmjs.com/package/adaptivecards#supporting-markdown");
          }
          return result;
      };
      AdaptiveCard.prototype.isVersionSupported = function () {
          if (this.bypassVersionCheck) {
              return true;
          }
          else {
              var unsupportedVersion = !this.version ||
                  !this.version.isValid ||
                  (AdaptiveCard.currentVersion.major < this.version.major) ||
                  (AdaptiveCard.currentVersion.major == this.version.major && AdaptiveCard.currentVersion.minor < this.version.minor);
              return !unsupportedVersion;
          }
      };
      AdaptiveCard.prototype.getItemsCollectionPropertyName = function () {
          return "body";
      };
      AdaptiveCard.prototype.internalRender = function () {
          var renderedElement = _super.prototype.internalRender.call(this);
          if (AdaptiveCard.useAdvancedCardBottomTruncation) {
              // Unlike containers, the root card element should be allowed to
              // be shorter than its content (otherwise the overflow truncation
              // logic would never get triggered)
              renderedElement.style.minHeight = null;
          }
          return renderedElement;
      };
      AdaptiveCard.prototype.getHasBackground = function () {
          return true;
      };
      AdaptiveCard.prototype.getDefaultPadding = function () {
          return new shared.PaddingDefinition(enums.Spacing.Padding, enums.Spacing.Padding, enums.Spacing.Padding, enums.Spacing.Padding);
      };
      Object.defineProperty(AdaptiveCard.prototype, "renderIfEmpty", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AdaptiveCard.prototype, "bypassVersionCheck", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AdaptiveCard.prototype, "allowCustomStyle", {
          get: function () {
              return this.hostConfig.adaptiveCard && this.hostConfig.adaptiveCard.allowCustomStyle;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AdaptiveCard.prototype, "hasBackground", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      AdaptiveCard.prototype.getJsonTypeName = function () {
          return "AdaptiveCard";
      };
      AdaptiveCard.prototype.toJSON = function () {
          var result = _super.prototype.toJSON.call(this);
          utils.setProperty(result, "$schema", "http://adaptivecards.io/schemas/adaptive-card.json");
          if (!this.bypassVersionCheck && this.version) {
              utils.setProperty(result, "version", this.version.toString());
          }
          utils.setProperty(result, "fallbackText", this.fallbackText);
          utils.setProperty(result, "lang", this.lang);
          utils.setProperty(result, "speak", this.speak);
          return result;
      };
      AdaptiveCard.prototype.internalValidateProperties = function (context) {
          _super.prototype.internalValidateProperties.call(this, context);
          if (this._cardTypeName != "AdaptiveCard") {
              context.addFailure(this, {
                  error: enums.ValidationError.MissingCardType,
                  message: "Invalid or missing card type. Make sure the card's type property is set to \"AdaptiveCard\"."
              });
          }
          if (!this.bypassVersionCheck && !this.version) {
              context.addFailure(this, {
                  error: enums.ValidationError.PropertyCantBeNull,
                  message: "The version property must be specified."
              });
          }
          else if (!this.isVersionSupported()) {
              context.addFailure(this, {
                  error: enums.ValidationError.UnsupportedCardVersion,
                  message: "The specified card version (" + this.version + ") is not supported. The maximum supported card version is " + AdaptiveCard.currentVersion
              });
          }
      };
      AdaptiveCard.prototype.parse = function (json, errors) {
          this._fallbackCard = null;
          this._cardTypeName = utils.getStringValue(json["type"]);
          this.speak = utils.getStringValue(json["speak"]);
          var langId = json["lang"];
          if (langId && typeof langId === "string") {
              try {
                  this.lang = langId;
              }
              catch (e) {
                  raiseParseError({
                      error: enums.ValidationError.InvalidPropertyValue,
                      message: e.message
                  }, errors);
              }
          }
          this.version = hostConfig.Version.parse(json["version"], errors);
          this.fallbackText = utils.getStringValue(json["fallbackText"]);
          var fallbackElement = createElementInstance(null, json["fallback"], !this.isDesignMode(), errors);
          if (fallbackElement) {
              this._fallbackCard = new AdaptiveCard();
              this._fallbackCard.addItem(fallbackElement);
          }
          _super.prototype.parse.call(this, json, errors);
      };
      AdaptiveCard.prototype.render = function (target) {
          var renderedCard;
          if (this.shouldFallback() && this._fallbackCard) {
              this._fallbackCard.hostConfig = this.hostConfig;
              renderedCard = this._fallbackCard.render();
          }
          else {
              renderedCard = _super.prototype.render.call(this);
              if (renderedCard) {
                  renderedCard.classList.add(this.hostConfig.makeCssClassName("ac-adaptiveCard"));
                  renderedCard.tabIndex = 0;
                  if (!utils.isNullOrEmpty(this.speak)) {
                      renderedCard.setAttribute("aria-label", this.speak);
                  }
              }
          }
          if (target) {
              target.appendChild(renderedCard);
              this.updateLayout();
          }
          return renderedCard;
      };
      AdaptiveCard.prototype.updateLayout = function (processChildren) {
          if (processChildren === void 0) { processChildren = true; }
          _super.prototype.updateLayout.call(this, processChildren);
          if (AdaptiveCard.useAdvancedCardBottomTruncation && this.isRendered()) {
              var card = this.renderedElement;
              var padding = this.hostConfig.getEffectiveSpacing(enums.Spacing.Default);
              this['handleOverflow'](card.offsetHeight - padding);
          }
      };
      AdaptiveCard.prototype.shouldFallback = function () {
          return _super.prototype.shouldFallback.call(this) || !this.isVersionSupported();
      };
      Object.defineProperty(AdaptiveCard.prototype, "hasVisibleSeparator", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      AdaptiveCard.currentVersion = new hostConfig.Version(1, 2);
      AdaptiveCard.useAdvancedTextBlockTruncation = true;
      AdaptiveCard.useAdvancedCardBottomTruncation = false;
      AdaptiveCard.useMarkdownInRadioButtonAndCheckbox = true;
      AdaptiveCard.allowMarkForTextHighlighting = false;
      AdaptiveCard.alwaysBleedSeparators = false;
      AdaptiveCard.enableFullJsonRoundTrip = false;
      AdaptiveCard.useBuiltInInputValidation = false;
      AdaptiveCard.displayInputValidationErrors = true;
      AdaptiveCard.elementTypeRegistry = new ElementTypeRegistry();
      AdaptiveCard.actionTypeRegistry = new ActionTypeRegistry();
      AdaptiveCard.onAnchorClicked = null;
      AdaptiveCard.onExecuteAction = null;
      AdaptiveCard.onElementVisibilityChanged = null;
      AdaptiveCard.onImageLoaded = null;
      AdaptiveCard.onInlineCardExpanded = null;
      AdaptiveCard.onInputValueChanged = null;
      AdaptiveCard.onParseElement = null;
      AdaptiveCard.onParseAction = null;
      AdaptiveCard.onParseError = null;
      AdaptiveCard.onProcessMarkdown = null;
      return AdaptiveCard;
  }(ContainerWithActions));
  exports.AdaptiveCard = AdaptiveCard;
  var InlineAdaptiveCard = /** @class */ (function (_super) {
      __extends(InlineAdaptiveCard, _super);
      function InlineAdaptiveCard() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.suppressStyle = false;
          return _this;
      }
      InlineAdaptiveCard.prototype.getDefaultPadding = function () {
          return new shared.PaddingDefinition(this.suppressStyle ? enums.Spacing.None : enums.Spacing.Padding, enums.Spacing.Padding, this.suppressStyle ? enums.Spacing.None : enums.Spacing.Padding, enums.Spacing.Padding);
      };
      Object.defineProperty(InlineAdaptiveCard.prototype, "bypassVersionCheck", {
          get: function () {
              return true;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(InlineAdaptiveCard.prototype, "defaultStyle", {
          get: function () {
              if (this.suppressStyle) {
                  return enums.ContainerStyle.Default;
              }
              else {
                  return this.hostConfig.actions.showCard.style ? this.hostConfig.actions.showCard.style : enums.ContainerStyle.Emphasis;
              }
          },
          enumerable: true,
          configurable: true
      });
      InlineAdaptiveCard.prototype.render = function (target) {
          var renderedCard = _super.prototype.render.call(this, target);
          renderedCard.setAttribute("aria-live", "polite");
          renderedCard.removeAttribute("tabindex");
          return renderedCard;
      };
      InlineAdaptiveCard.prototype.getForbiddenActionTypes = function () {
          return [ShowCardAction];
      };
      return InlineAdaptiveCard;
  }(AdaptiveCard));
  var defaultHostConfig = new hostConfig.HostConfig({
      supportsInteractivity: true,
      spacing: {
          small: 10,
          default: 20,
          medium: 30,
          large: 40,
          extraLarge: 50,
          padding: 20
      },
      separator: {
          lineThickness: 1,
          lineColor: "#EEEEEE"
      },
      fontTypes: {
          default: {
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              fontSizes: {
                  small: 12,
                  default: 14,
                  medium: 17,
                  large: 21,
                  extraLarge: 26
              },
              fontWeights: {
                  lighter: 200,
                  default: 400,
                  bolder: 600
              }
          },
          monospace: {
              fontFamily: "'Courier New', Courier, monospace",
              fontSizes: {
                  small: 12,
                  default: 14,
                  medium: 17,
                  large: 21,
                  extraLarge: 26
              },
              fontWeights: {
                  lighter: 200,
                  default: 400,
                  bolder: 600
              }
          }
      },
      imageSizes: {
          small: 40,
          medium: 80,
          large: 160
      },
      containerStyles: {
          default: {
              backgroundColor: "#FFFFFF",
              foregroundColors: {
                  default: {
                      default: "#333333",
                      subtle: "#EE333333"
                  },
                  dark: {
                      default: "#000000",
                      subtle: "#66000000"
                  },
                  light: {
                      default: "#FFFFFF",
                      subtle: "#33000000"
                  },
                  accent: {
                      default: "#2E89FC",
                      subtle: "#882E89FC"
                  },
                  attention: {
                      default: "#cc3300",
                      subtle: "#DDcc3300"
                  },
                  good: {
                      default: "#54a254",
                      subtle: "#DD54a254"
                  },
                  warning: {
                      default: "#e69500",
                      subtle: "#DDe69500"
                  }
              }
          },
          emphasis: {
              backgroundColor: "#08000000",
              foregroundColors: {
                  default: {
                      default: "#333333",
                      subtle: "#EE333333"
                  },
                  dark: {
                      default: "#000000",
                      subtle: "#66000000"
                  },
                  light: {
                      default: "#FFFFFF",
                      subtle: "#33000000"
                  },
                  accent: {
                      default: "#2E89FC",
                      subtle: "#882E89FC"
                  },
                  attention: {
                      default: "#cc3300",
                      subtle: "#DDcc3300"
                  },
                  good: {
                      default: "#54a254",
                      subtle: "#DD54a254"
                  },
                  warning: {
                      default: "#e69500",
                      subtle: "#DDe69500"
                  }
              }
          },
          accent: {
              backgroundColor: "#C7DEF9",
              foregroundColors: {
                  default: {
                      default: "#333333",
                      subtle: "#EE333333"
                  },
                  dark: {
                      default: "#000000",
                      subtle: "#66000000"
                  },
                  light: {
                      default: "#FFFFFF",
                      subtle: "#33000000"
                  },
                  accent: {
                      default: "#2E89FC",
                      subtle: "#882E89FC"
                  },
                  attention: {
                      default: "#cc3300",
                      subtle: "#DDcc3300"
                  },
                  good: {
                      default: "#54a254",
                      subtle: "#DD54a254"
                  },
                  warning: {
                      default: "#e69500",
                      subtle: "#DDe69500"
                  }
              }
          },
          good: {
              backgroundColor: "#CCFFCC",
              foregroundColors: {
                  default: {
                      default: "#333333",
                      subtle: "#EE333333"
                  },
                  dark: {
                      default: "#000000",
                      subtle: "#66000000"
                  },
                  light: {
                      default: "#FFFFFF",
                      subtle: "#33000000"
                  },
                  accent: {
                      default: "#2E89FC",
                      subtle: "#882E89FC"
                  },
                  attention: {
                      default: "#cc3300",
                      subtle: "#DDcc3300"
                  },
                  good: {
                      default: "#54a254",
                      subtle: "#DD54a254"
                  },
                  warning: {
                      default: "#e69500",
                      subtle: "#DDe69500"
                  }
              }
          },
          attention: {
              backgroundColor: "#FFC5B2",
              foregroundColors: {
                  default: {
                      default: "#333333",
                      subtle: "#EE333333"
                  },
                  dark: {
                      default: "#000000",
                      subtle: "#66000000"
                  },
                  light: {
                      default: "#FFFFFF",
                      subtle: "#33000000"
                  },
                  accent: {
                      default: "#2E89FC",
                      subtle: "#882E89FC"
                  },
                  attention: {
                      default: "#cc3300",
                      subtle: "#DDcc3300"
                  },
                  good: {
                      default: "#54a254",
                      subtle: "#DD54a254"
                  },
                  warning: {
                      default: "#e69500",
                      subtle: "#DDe69500"
                  }
              }
          },
          warning: {
              backgroundColor: "#FFE2B2",
              foregroundColors: {
                  default: {
                      default: "#333333",
                      subtle: "#EE333333"
                  },
                  dark: {
                      default: "#000000",
                      subtle: "#66000000"
                  },
                  light: {
                      default: "#FFFFFF",
                      subtle: "#33000000"
                  },
                  accent: {
                      default: "#2E89FC",
                      subtle: "#882E89FC"
                  },
                  attention: {
                      default: "#cc3300",
                      subtle: "#DDcc3300"
                  },
                  good: {
                      default: "#54a254",
                      subtle: "#DD54a254"
                  },
                  warning: {
                      default: "#e69500",
                      subtle: "#DDe69500"
                  }
              }
          }
      },
      actions: {
          maxActions: 5,
          spacing: enums.Spacing.Default,
          buttonSpacing: 10,
          showCard: {
              actionMode: enums.ShowCardActionMode.Inline,
              inlineTopMargin: 16
          },
          actionsOrientation: enums.Orientation.Horizontal,
          actionAlignment: enums.ActionAlignment.Left
      },
      adaptiveCard: {
          allowCustomStyle: false
      },
      imageSet: {
          imageSize: enums.Size.Medium,
          maxImageHeight: 100
      },
      factSet: {
          title: {
              color: enums.TextColor.Default,
              size: enums.TextSize.Default,
              isSubtle: false,
              weight: enums.TextWeight.Bolder,
              wrap: true,
              maxWidth: 150,
          },
          value: {
              color: enums.TextColor.Default,
              size: enums.TextSize.Default,
              isSubtle: false,
              weight: enums.TextWeight.Default,
              wrap: true,
          },
          spacing: 10
      }
  });
  //# sourceMappingURL=card-elements.js.map
  });

  unwrapExports(cardElements);
  var cardElements_1 = cardElements.createActionInstance;
  var cardElements_2 = cardElements.createElementInstance;
  var cardElements_3 = cardElements.SerializableObject;
  var cardElements_4 = cardElements.ValidationFailure;
  var cardElements_5 = cardElements.ValidationResults;
  var cardElements_6 = cardElements.CardObject;
  var cardElements_7 = cardElements.CardElement;
  var cardElements_8 = cardElements.BaseTextBlock;
  var cardElements_9 = cardElements.TextBlock;
  var cardElements_10 = cardElements.TextRun;
  var cardElements_11 = cardElements.RichTextBlock;
  var cardElements_12 = cardElements.Fact;
  var cardElements_13 = cardElements.FactSet;
  var cardElements_14 = cardElements.Image;
  var cardElements_15 = cardElements.CardElementContainer;
  var cardElements_16 = cardElements.ImageSet;
  var cardElements_17 = cardElements.MediaSource;
  var cardElements_18 = cardElements.Media;
  var cardElements_19 = cardElements.InputValidationOptions;
  var cardElements_20 = cardElements.Input;
  var cardElements_21 = cardElements.TextInput;
  var cardElements_22 = cardElements.ToggleInput;
  var cardElements_23 = cardElements.Choice;
  var cardElements_24 = cardElements.ChoiceSetInput;
  var cardElements_25 = cardElements.NumberInput;
  var cardElements_26 = cardElements.DateInput;
  var cardElements_27 = cardElements.TimeInput;
  var cardElements_28 = cardElements.Action;
  var cardElements_29 = cardElements.SubmitAction;
  var cardElements_30 = cardElements.OpenUrlAction;
  var cardElements_31 = cardElements.ToggleVisibilityAction;
  var cardElements_32 = cardElements.HttpHeader;
  var cardElements_33 = cardElements.HttpAction;
  var cardElements_34 = cardElements.ShowCardAction;
  var cardElements_35 = cardElements.ActionSet;
  var cardElements_36 = cardElements.StylableCardElementContainer;
  var cardElements_37 = cardElements.BackgroundImage;
  var cardElements_38 = cardElements.Container;
  var cardElements_39 = cardElements.Column;
  var cardElements_40 = cardElements.ColumnSet;
  var cardElements_41 = cardElements.ContainerWithActions;
  var cardElements_42 = cardElements.TypeRegistry;
  var cardElements_43 = cardElements.ElementTypeRegistry;
  var cardElements_44 = cardElements.ActionTypeRegistry;
  var cardElements_45 = cardElements.AdaptiveCard;

  var adaptivecards = createCommonjsModule(function (module, exports) {
  function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  // Copyright (c) Microsoft Corporation. All rights reserved.
  // Licensed under the MIT License.
  __export(cardElements);
  __export(enums);
  __export(hostConfig);
  __export(shared);
  __export(utils);
  //# sourceMappingURL=adaptivecards.js.map
  });

  unwrapExports(adaptivecards);
  var adaptivecards_1 = adaptivecards.AdaptiveCard;
  var adaptivecards_2 = adaptivecards.Version;
  var adaptivecards_3 = adaptivecards.TextBlock;
  var adaptivecards_4 = adaptivecards.Image;

  class Store {
      constructor(dbName = 'keyval-store', storeName = 'keyval') {
          this.storeName = storeName;
          this._dbp = new Promise((resolve, reject) => {
              const openreq = indexedDB.open(dbName, 1);
              openreq.onerror = () => reject(openreq.error);
              openreq.onsuccess = () => resolve(openreq.result);
              // First time setup: create an empty object store
              openreq.onupgradeneeded = () => {
                  openreq.result.createObjectStore(storeName);
              };
          });
      }
      _withIDBStore(type, callback) {
          return this._dbp.then(db => new Promise((resolve, reject) => {
              const transaction = db.transaction(this.storeName, type);
              transaction.oncomplete = () => resolve();
              transaction.onabort = transaction.onerror = () => reject(transaction.error);
              callback(transaction.objectStore(this.storeName));
          }));
      }
  }
  let store;
  function getDefaultStore() {
      if (!store)
          store = new Store();
      return store;
  }
  function get(key, store = getDefaultStore()) {
      let req;
      return store._withIDBStore('readonly', store => {
          req = store.get(key);
      }).then(() => req.result);
  }
  function set(key, value, store = getDefaultStore()) {
      return store._withIDBStore('readwrite', store => {
          store.put(value, key);
      });
  }

  let pwbadapcard = _decorate([customElement('pwb-adapcard')], function (_initialize, _LitElement) {
      class pwbadapcard extends _LitElement {
          constructor(...args) {
              super(...args);
              _initialize(this);
          }
      }
      return {
          F: pwbadapcard,
          d: [{
                  kind: "field",
                  decorators: [property()],
                  key: "text",
                  value: void 0
              }, {
                  kind: "field",
                  decorators: [property()],
                  key: "imageUrl",
                  value: void 0
              }, {
                  kind: "field",
                  decorators: [property()],
                  key: "cardsToRender",
                  value: void 0
              }, {
                  kind: "field",
                  decorators: [property()],
                  key: "title",
                  value() {
                      return "Cards";
                  }
              }, {
                  kind: "method",
                  static: true,
                  key: "getStyles",
                  value: function getStyles() {
                      return css `
      h3 {
        font-family: sans-serif;
      }
    `;
                  }
              }, {
                  kind: "method",
                  key: "firstUpdated",
                  value: function firstUpdated() {
                      return __awaiter(this, void 0, void 0, function* () {
                          yield this.getCards();
                      });
                  }
              }, {
                  kind: "method",
                  key: "createCard",
                  value: function createCard() {
                      return __awaiter(this, void 0, void 0, function* () {
                          let card = new adaptivecards_1();
                          card.version = new adaptivecards_2(1, 0);
                          if (this.text) {
                              let textBlock = new adaptivecards_3();
                              textBlock.text = "Hello World";
                              card.addItem(textBlock);
                          }
                          if (this.imageUrl) {
                              let imageBlock = new adaptivecards_4();
                              imageBlock.url = this.imageUrl;
                              card.addItem(imageBlock);
                          }
                          const cardJSON = card.toJSON();
                          yield this.storeCard(cardJSON);
                          yield this.getCards();
                          return cardJSON;
                      });
                  }
              }, {
                  kind: "method",
                  key: "storeCard",
                  value: function storeCard(cardJSON) {
                      return __awaiter(this, void 0, void 0, function* () {
                          let cards = yield get("pwbCards");
                          if (cards) {
                              cards.push(cardJSON);
                          }
                          else {
                              yield set("pwbCards", [cardJSON]);
                          }
                      });
                  }
              }, {
                  kind: "method",
                  key: "getCards",
                  value: function getCards() {
                      return __awaiter(this, void 0, void 0, function* () {
                          const jsonCards = yield get("pwbCards");
                          let tempCards = [];
                          if (jsonCards && jsonCards.length > 0) {
                              jsonCards.forEach(cardJSON => {
                                  let card = new adaptivecards_1();
                                  card.parse(cardJSON);
                                  let renderedCard = card.render();
                                  tempCards.push(renderedCard);
                              });
                              this.cardsToRender = tempCards;
                          }
                      });
                  }
              }, {
                  kind: "method",
                  key: "render",
                  value: function render() {
                      return html `
      <div>
        <h3>${this.title}</h3>
      </div>
      <ul>
      ${this.cardsToRender ? html `
           ${this.cardsToRender.map(card => {
                        return html `
               ${card}
               `;
                    })}
         ` : null}
      </ul>
    `;
                  }
              }]
      };
  }, LitElement);
  //# sourceMappingURL=pwb-adapcard.js.map

  exports.pwbadapcard = pwbadapcard;
  exports.pwbclipboard = pwbclipboard;
  exports.pwbgeolocation = pwbgeolocation;
  exports.pwbinstall = pwbinstall;
  exports.pwbshare = pwbshare;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
