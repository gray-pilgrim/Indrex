/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup/popup.tsx":
/*!*****************************!*\
  !*** ./src/popup/popup.tsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-helmet */ "./node_modules/react-helmet/es/Helmet.js");
/* harmony import */ var _assets_tailwind_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/tailwind.css */ "./src/assets/tailwind.css");
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! firebase/firestore */ "./node_modules/firebase/firestore/dist/esm/index.esm.js");
/* harmony import */ var _assets_Banner_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/Banner.png */ "./src/assets/Banner.png");
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./firebase */ "./src/popup/firebase.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





// Icons for recording options




const db = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.getFirestore)(_firebase__WEBPACK_IMPORTED_MODULE_6__["default"]);
const saveIntoDb = (name, type, reviews) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRef = yield (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.addDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.collection)(db, "main-db"), {
            name: name,
            type: type,
            reviews: reviews,
        });
        console.log("Document written with ID: ", docRef.id);
    }
    catch (e) {
        console.error("Error adding document: ", e);
    }
});
const getDataFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const querySnapshot = yield (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.getDocs)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.collection)(db, "main-db"));
    querySnapshot.forEach((doc) => {
        alert(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
});
const Popup = () => {
    const [inclusivityRating, setInclusivityRating] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
    const [isRequestInProgress, setIsRequestInProgress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [inclusivityAnalysis, setInclusivityAnalysis] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [augmentingProducts, setAugmentingProducts] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const [currentUrl, setCurrentUrl] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    // States for disability and recording options
    const [prelimSelection, setpreliminarySelection] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''); // This is the preliminary selection [Blindness, Deafness, Non-Verbal, Low-Vision, Hard of Hearing, Paraplegic
    const [disabilitySelection, setDisabilitySelection] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [recordingSelection, setRecordingSelection] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('cam-only');
    const [recordingIcon, setRecordingIcon] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(_assets_Banner_png__WEBPACK_IMPORTED_MODULE_5__);
    // States for the review form
    const [name, setName] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [review, setReview] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [reviews, setReviews] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]); // State to hold the list of reviews
    const [htmlContent, setHtmlContent] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    // Load reviews from chrome.storage when the component mounts
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        // Listen for messages from the content script
        // Fetch reviews from storage
        chrome.storage.sync.get(['reviews']).then((result) => {
            if (result.reviews) {
                setReviews(result.reviews);
            }
        });
        chrome.runtime.onMessage.addListener((message) => {
            if (message.html) {
                setHtmlContent(message.html);
            }
        });
        chrome.runtime.onMessage.addListener((message) => {
            if (message.html) {
                fetch('http://localhost:5000/receive_html', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ htmlContent: message.html, disabilityType: message.disabilityType, preliminaryType: message.preliminaryType })
                })
                    .then(response => response.json())
                    .then(data => {
                    setInclusivityAnalysis(data.inclusivity_analysis);
                    setAugmentingProducts(data.augmenting_products || []);
                    setInclusivityRating(data.inclusivity_rating); // Update inclusivity rating
                    setIsRequestInProgress(false);
                })
                    .catch(error => {
                    console.error('Error:', error);
                    setIsRequestInProgress(false);
                });
            }
        });
        // Trigger the content script to send HTML when the popup is opened
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['contentScript.js']
            });
        });
    }, []);
    // Handlers for disability and recording options
    const handleDisabilitySelectionChange = (event) => {
        setDisabilitySelection(event.target.value);
    };
    const handlepreliminarySelectionChange = (event) => {
        setpreliminarySelection(event.target.value);
    };
    const handleRecordingSelectionChange = (event) => {
        setRecordingSelection(event.target.value);
        switch (event.target.value) {
            case 'screen-cam':
                setRecordingIcon(_assets_Banner_png__WEBPACK_IMPORTED_MODULE_5__);
                break;
            case 'screen-only':
                setRecordingIcon(_assets_Banner_png__WEBPACK_IMPORTED_MODULE_5__);
                break;
            case 'cam-only':
                setRecordingIcon(_assets_Banner_png__WEBPACK_IMPORTED_MODULE_5__);
                break;
            default:
                setRecordingIcon(null); // or a default icon
        }
    };
    const startRecording = () => {
        // Prevent multiple requests if one is already in progress
        if (isRequestInProgress) {
            return;
        }
        setIsRequestInProgress(true); // Set to true when request starts
        console.log('Recording option selected:', recordingSelection);
        console.log('Disability Type:', disabilitySelection);
        // Send a message to the active tab to fetch HTML content along with the disability type
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "fetchHTML", disabilityType: disabilitySelection, preliminaryType: prelimSelection });
        });
    };
    // Function to handle review form submission
    const submitReview = (event) => {
        event.preventDefault();
        const newReview = { name, review };
        const updatedReviews = [...reviews, newReview];
        saveIntoDb(name, prelimSelection, review);
        // Save the updated reviews array to chrome.storage
        chrome.storage.sync.set({ reviews: updatedReviews }).then(() => {
            console.log('Review submitted:', newReview);
            setReviews(updatedReviews); // Update state with new review
        });
        // Reset form fields
        setName('');
        setReview('');
    };
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "p-4" },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", { className: "text-5xl text-green-500 mb-4" }, "INDREX"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_helmet__WEBPACK_IMPORTED_MODULE_2__.Helmet, null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", { charSet: "UTF-8" }),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("link", { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" }),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("title", null, "Disability Analysis Tool")),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("select", { value: prelimSelection, onChange: (e) => setpreliminarySelection(e.target.value), className: "border border-gray-300 rounded p-2", name: "disabilityType", id: "disabilityType" },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: "" }, "Select disability type"),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: "Blindness" }, "Blindness"),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: "Deafness" }, "Deafness"),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: "Nonverbal" }, "Non-Verbal"),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: "Lowvision" }, "Low-vision"),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: "HardofHearing" }, "Hard of Hearing"))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "mb-4" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { type: "text", id: "output", name: "Additional Details", value: disabilitySelection, onChange: (e) => setDisabilitySelection(e.target.value), className: "border border-gray-300 rounded p-2", placeholder: "Enter Additional Details", "aria-label": "Additional Details", required: true })),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: startRecording, className: "bg-red-500 text-white px-4 py-2 rounded" }, "Analyze"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null,
                "Inclusivity Rating: ",
                inclusivityRating),
            " "),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("textarea", { id: "output", name: "output", placeholder: "output", "aria-label": "output", value: inclusivityAnalysis, readOnly: true, className: "border border-gray-300 rounded p-2 w-full", style: { minHeight: '50px', resize: 'none' } })),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null, "Augmenting Products"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", null, augmentingProducts.map((product, index) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", { key: index }, product))))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", { "aria-label": "Subscribe example" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "container" },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("article", null,
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("hgroup", null,
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null, "Feedback"),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, "Share Your Experience")),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", { onSubmit: submitReview, className: "mb-4" },
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), id: "firstname", name: "firstname", placeholder: "Name", "aria-label": "Name", required: true }),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { type: "text", value: review, onChange: (e) => setReview(e.target.value), id: "opinion", name: "opinion", placeholder: "Opinion", "aria-label": "Opinion", required: true }),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { type: "submit", color: 'blue' }, "Submit"))))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "review-section h-40 overflow-auto border border-gray-300 p-2 my-4" }, reviews.map((review, index) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { key: index, className: "review mb-2" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", { className: "font-bold" }, review.name),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, review.review)))))));
};
const container = document.createElement('div');
document.body.appendChild(container);
const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(container);
root.render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Popup, null));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Popup);


/***/ }),

/***/ "./src/popup/firebase.ts":
/*!*******************************!*\
  !*** ./src/popup/firebase.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/app */ "./node_modules/firebase/app/dist/esm/index.esm.js");
/* harmony import */ var firebase_analytics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/analytics */ "./node_modules/firebase/analytics/dist/esm/index.esm.js");
// Import the functions you need from the SDKs you need


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnv5qpLN3peM_ZefHVECF72pT4SejgZOw",
  authDomain: "indrex-22c70.firebaseapp.com",
  projectId: "indrex-22c70",
  storageBucket: "indrex-22c70.appspot.com",
  messagingSenderId: "218932251969",
  appId: "1:218932251969:web:16f3dcfc87b42b2ce125c0",
  measurementId: "G-HSR02WVZ0B"
};

// Initialize Firebase
const firebase = (0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp)(firebaseConfig);
// const analytics = getAnalytics(app);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (firebase);

/***/ }),

/***/ "./src/assets/Banner.png":
/*!*******************************!*\
  !*** ./src/assets/Banner.png ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/f30cd11ff548b19631ba.png";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"popup": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkchrome_ext"] = self["webpackChunkchrome_ext"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_react-dom_client_js","vendors-node_modules_css-loader_dist_runtime_api_js-node_modules_css-loader_dist_runtime_sour-a92e04","src_assets_tailwind_css"], () => (__webpack_require__("./src/popup/popup.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=popup.js.map