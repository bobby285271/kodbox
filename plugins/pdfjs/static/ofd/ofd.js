var getFontFamilyMore = function(font) {
	if (font.indexOf('tttt') !== -1) {
		return font;
	}
	var fontArr = {
		"方正小标宋简体": "FZXiaoBiaoSong-B05S",
		"仿宋": "FangSong",
		"宋体": "SimSun",
		"新宋体": "SimSun",
		"华文彩云": "STCaiyun",
		"华文隶书": "STLiTi",
		"黑体": '"STHeiti","STHeiti SC Medium"'
	};
	if (fontArr[font]) {
		font = font + ',' + fontArr[font];
	}
	font = font + ',宋体,SimSun,Verdana,"Lantinghei SC",微软雅黑,"Microsoft Yahei",tttt';
	return font;
}
var renderScaleDefault = 3.8; //3.8 页面大小设置 默认2.834646
// 字体重影问题: .fillText==> 删除描边strokeText
// 文字层高度调整: var o = o - e.size*0.9 + e.size;
// 大标题丢失: .fillText  :  for (var S = 0; S < b.length; S++)	this.createPath(n, b[S]);

!function(t) {
	function e(r) {
		if (n[r]) return n[r].exports;
		var i = n[r] = {
			i: r,
			l: !1,
			exports: {}
		};
		return t[r].call(i.exports, i, i.exports, e),
		i.l = !0,
		i.exports
	}
	var n = {};
	e.m = t,
	e.c = n,
	e.d = function(t, n, r) {
		e.o(t, n) || Object.defineProperty(t, n, {
			configurable: !1,
			enumerable: !0,
			get: r
		})
	},
	e.n = function(t) {
		var n = t && t.__esModule ?
		function() {
			return t.
		default
		}:
		function() {
			return t
		};
		return e.d(n, "a", n),
		n
	},
	e.o = function(t, e) {
		return Object.prototype.hasOwnProperty.call(t, e)
	},
	e.p = "",
	e(e.s = 16)
} ([function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = function() {
		function t(t) {
			this.font = t
		}
		return t.prototype.getCheckSum = function() {
			return this.checkSum
		},
		t.prototype.setCheckSum = function(t) {
			this.checkSum = t
		},
		t.prototype.getLength = function() {
			return this.length
		},
		t.prototype.setLength = function(t) {
			this.length = t
		},
		t.prototype.getOffset = function() {
			return this.offset
		},
		t.prototype.setOffset = function(t) {
			this.offset = t
		},
		t.prototype.getTag = function() {
			return this.tag
		},
		t.prototype.setTag = function(t) {
			this.tag = t
		},
		t.prototype.getInitialized = function() {
			return this.initialized
		},
		t.prototype.read = function(t, e) {},
		t
	} ();
	e.TTFTable = r
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = function() {
		function t() {}
		return t
	} ();
	e.FontInfo = r;
	var i = function() {
		function t() {}
		return t.prototype.reset = function(t, e) {
			this.width = t,
			this.height = e
		},
		t
	} ();
	e.Size = i;
	var o = function() {
		function t() {}
		return t.prototype.reset = function(t, e, n, r, i) {
			this.x = t,
			this.y = e,
			this.width = n,
			this.height = r,
			this.valid = i
		},
		t
	} ();
	e.Rectangle = o;
	var s = function() {
		function t() {}
		return t.parseParam = function(t) {
			for (var e = {},
			n = t.substring(1), r = n.split("&"), i = 0; i < r.length; i++) {
				var o = r[i].split("=");
				if (void 0 === e[o[0]]) e[o[0]] = decodeURIComponent(o[1]);
				else if ("string" == typeof e[o[0]]) {
					var s = [e[o[0]], decodeURIComponent(o[1])];
					e[o[0]] = s
				} else e[o[0]].push(decodeURIComponent(o[1]))
			}
			return e
		},
		t.open = function(t, e) {
			JSZipUtils.getBinaryContent(t,
			function(t, n) {
				if (t) return void console.log(t); (new JSZip).loadAsync(n).then(e)
			})
		},
		t.createCanvas = function(e, n, r, i) {
			var o = document.createElement("canvas");
			return o.width = e,
			o.height = n,
			i && o.setAttribute("style", i),
			1 != r && t.scale(o.getContext("2d"), o, r),
			o
		},
		t.scale = function(t, e, n) {
			var r = e.width,
			i = e.height;
			e.width = r * n,
			e.height = i * n,
			e.style.width = r + "px",
			e.style.height = i + "px",
			t.scale(n, n)
		},
		t.resizeCanvas = function(t, e, n) {
			t.width = n * e,
			t.style.width = n + "px",
			t.getContext("2d").scale(e, e)
		},
		t.getBrowserType = function() {
			var t = window.navigator.userAgent.toLowerCase();
			return t.indexOf("edge") >= 0 ? "edge": t.indexOf("firefox") >= 0 ? "firefox": t.indexOf("Safari") >= 0 ? "Safari": t.indexOf("chrome") >= 0 ? "chrome": -1 != t.indexOf("msie") || -1 != t.indexOf("windows") ? "ie": void 0
		},
		t.arrayCopy = function(t, e, n, r, i) {
			for (var o = 0; o < i; o++) n[r++] = t[e++]
		},
		t.copyOfRange = function(e, n, r) {
			var i = Math.min(e.length - n, r - n),
			o = new Uint8Array(i);
			return t.arrayCopy(e, n, o, 0, i),
			o
		},
		t.bytesToString = function(t) {
			var e = t.length;
			if (e < 8192) return String.fromCharCode.apply(null, t);
			for (var n = [], r = 0; r < e; r += 8192) {
				var i = Math.min(r + 8192, e),
				o = t.subarray(r, i);
				n.push(String.fromCharCode.apply(null, o))
			}
			return n.join("")
		},
		t.stringToBytes = function(t) {
			for (var e = t.length,
			n = new Uint8Array(e), r = 0; r < e; ++r) n[r] = 255 & t.charCodeAt(r);
			return n
		},
		t.binarySearch = function(t, e) {
			e.sort();
			for (var n = 0; n < t.length; n++) {
				var r = t[n];
				if (r.sort(), e.length == r.length) {
					for (var i = 0; i < e.length && r[i] == e[i]; i++);
					if (i == e.length) return n
				}
			}
			return - 1
		},
		t.attr = function(t, e) {
			for (var n = e.attributes,
			r = n.length,
			i = 0; i < r; i++) t[n[i].name] = n[i].value
		},
		t.getFont2 = function(e) {
			var n = t.fonts,
			i = n[e];
			return i || (i = new r, i.gfont = e, n[e] = i, t.measureFont(i), i)
		},
		t.getFont = function(e, n, i, o, s) {
			void 0 === i && (i = !1),
			void 0 === o && (o = !1);
			var a = t.fonts,
			h = (o ? "italic ": "") + (i ? "bold ": "") + n + "px " + e,
			p = a[h];
			return p || (p = new r, p.gfont = h, p.name = e, p.sz = n, p.i = o, p.b = i, a[h] = p, t.measureFont(p), p.height = t.calcFontHeight(n), s && (p.height += 5, p.descent += 5), p)
		},
		t.calcFontHeight = function(t) {
			var e, n = (1.297 * t).toFixed(2),
			r = parseInt(n.charAt(n.length - 1));
			return e = r <= 2 ? parseFloat(n.substring(0, n.length - 1)) : r >= 3 && r <= 7 ? parseFloat(n.substring(0, n.length - 1) + "5") : parseFloat(n.substring(0, n.length - 1)) + .1,
			e = parseFloat(e.toFixed(2))
		},
		t.measureFont = function(t) {
			var e, n, r;
			e = document.createElement("span"),
			n = document.createElement("div"),
			r = document.createElement("div"),
			n.style.display = "inline-block",
			n.style.width = "1px",
			n.style.height = "0",
			r.style.visibility = "hidden",
			r.style.position = "absolute",
			r.style.top = "0",
			r.style.left = "0",
			r.style.width = "500px",
			r.style.height = "200px",
			r.appendChild(e),
			r.appendChild(n),
			document.body.appendChild(r);
			try {
				e.setAttribute("style", "font:" + t.gfont),
				e.innerHTML = "",
				e.appendChild(document.createTextNode("gM")),
				n.style.verticalAlign = "baseline",
				t.ascent = n.offsetTop - e.offsetTop,
				n.style.verticalAlign = "bottom",
				t.height = n.offsetTop - e.offsetTop,
				t.descent = t.height - t.ascent
			} finally {
				r.parentNode.removeChild(r),
				r = null
			}
		},
		t
	} ();
	s.fonts = {},
	e.Util = s
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = function() {
		function t(t, e) {
			this.contourCount = t
		}
		return t.prototype.resolve = function() {},
		t.prototype.getContourCount = function() {
			return this.contourCount
		},
		t.prototype.getInstructions = function() {
			return this.instructions
		},
		t.prototype.readInstructions = function(t, e) {
			this.instructions = t.readUnsignedByteArray(e)
		},
		t
	} ();
	r.ON_CURVE = 1,
	r.X_SHORT_VECTOR = 2,
	r.Y_SHORT_VECTOR = 4,
	r.REPEAT = 8,
	r.X_DUAL = 16,
	r.Y_DUAL = 32,
	e.GlyfDescript = r
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = function() {
		function t() {
			this.pageRefs = [],
			this.pages = [],
			this.imageIds = {}
		}
		return t.prototype.init = function(t) {
			this.ofd = t,
			this.docRootPath = t.querySelector("DocRoot").textContent,
			this.dir = this.docRootPath.substring(0, this.docRootPath.indexOf("/") + 1)
		},
		t
	} ();
	e.Doc = i;
	var o = function() {
		function t() {
			this.objects = []
		}
		return t
	} ();
	e.Layer = o;
	var s = function() {
		function t() {
			this.texts = {},
			this.allText = "",
			this.charxy = [],
			this.images = []
		}
		return t
	} ();
	e.Page = s;
	var a = function() {
		function t() {}
		return t
	} ();
	e.Obj = a;
	var h = function(t) {
		function e() {
			return null !== t && t.apply(this, arguments) || this
		}
		return r(e, t),
		e
	} (a);
	e.PathObj = h;
	var p = function(t) {
		function e() {
			return null !== t && t.apply(this, arguments) || this
		}
		return r(e, t),
		e
	} (a);
	e.TextObj = p;
	var c = function(t) {
		function e() {
			return null !== t && t.apply(this, arguments) || this
		}
		return r(e, t),
		e
	} (a);
	e.ImageObj = c;
	var u = function() {
		function t() {}
		return t
	} ();
	e.Rect = u
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = n(19),
	i = n(36),
	o = n(37),
	s = n(13),
	a = function() {
		function t() {}
		return t
	} (),
	h = function() {
		function t() {}
		return t.reset = function() {
			t.fonts = {}
		},
		t.getGlyphPath = function(e, n) {
			var r = t.fonts[e.ID];
			if (!r) return null;
			for (var i = [], s = n.length, a = r.paths, h = t.NullPath, p = 0; p < s; p++) {
				var c = n[p],
				u = a.get(c);
				u || a.set(c, u = o.TTFGlyph2D.getPathForCharacterCode(r.ttf, c)),
				u || (u = h, a.set(c, u)),
				i[p] = u.data
			}
			return i
		},
		t.parseAllFonts = function(e, n) {
			t.cb = n;
			var r = t.fonts,
			i = Object.keys(r);
			if (i.length > 0) {
				for (var o = [], s = 0, a = i; s < a.length; s++) {
					var h = a[s];
					o.push(t.loadFont(e, r[h]))
				}
				Promise.all(o).then(function() {
					for (var e = 0,
					o = i; e < o.length; e++) {
						var s = o[e];
						t.parseFontData(r[s])
					}
					n()
				})
			} else n()
		},
		t.add = function(e) {
			var n = t.fonts;
			if (!n[e.ID]) {
				var r = new a;
				r.fontInfo = e,
				n[e.ID] = r
			}
		},
		t.loadFont = function(t, e) {
			var n = t.doc.dir + "Res/" + e.fontInfo.file;
			return t.zip.file(n).async("arraybuffer").then(function(t) {
				e.otfblob = t
			})
		},
		t.parseFontData = function(t) {
			var e = new r.TTFParser(!0, !1);
			t.paths = new Map;
			var n = t.ttf = e.parse(new i.TTFDataStream(new Uint8Array(t.otfblob))),
			o = n.getCmap();
			if (o) {
				var s = o.getCmaps();
				n.cmapTable = s && s.length > 0 && s[0]
			}
			n.glyphTable = n.getGlyph();
			var a = n.getHeader();
			n.unitsPerEm = t.fontInfo.unitsPerEm = a && a.getUnitsPerEm() || 1e3,
			1e3 != n.unitsPerEm && (n.scale = 1e3 / n.unitsPerEm)
		},
		t
	} ();
	h.NullPath = new s.GeneralPath,
	h.fonts = {},
	e.FontEngine = h
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.getMaxComponentDepth = function() {
			return this.maxComponentDepth
		},
		e.prototype.setMaxComponentDepth = function(t) {
			this.maxComponentDepth = t
		},
		e.prototype.getMaxComponentElements = function() {
			return this.maxComponentElements
		},
		e.prototype.setMaxComponentElements = function(t) {
			this.maxComponentElements = t
		},
		e.prototype.getMaxCompositeContours = function() {
			return this.maxCompositeContours
		},
		e.prototype.setMaxCompositeContours = function(t) {
			this.maxCompositeContours = t
		},
		e.prototype.getMaxCompositePoints = function() {
			return this.maxCompositePoints
		},
		e.prototype.setMaxCompositePoints = function(t) {
			this.maxCompositePoints = t
		},
		e.prototype.getMaxContours = function() {
			return this.maxContours
		},
		e.prototype.setMaxContours = function(t) {
			this.maxContours = t
		},
		e.prototype.getMaxFunctionDefs = function() {
			return this.maxFunctionDefs
		},
		e.prototype.setMaxFunctionDefs = function(t) {
			this.maxFunctionDefs = t
		},
		e.prototype.getMaxInstructionDefs = function() {
			return this.maxInstructionDefs
		},
		e.prototype.setMaxInstructionDefs = function(t) {
			this.maxInstructionDefs = t
		},
		e.prototype.getMaxPoints = function() {
			return this.maxPoints
		},
		e.prototype.setMaxPoints = function(t) {
			this.maxPoints = t
		},
		e.prototype.getMaxSizeOfInstructions = function() {
			return this.maxSizeOfInstructions
		},
		e.prototype.setMaxSizeOfInstructions = function(t) {
			this.maxSizeOfInstructions = t
		},
		e.prototype.getMaxStackElements = function() {
			return this.maxStackElements
		},
		e.prototype.setMaxStackElements = function(t) {
			this.maxStackElements = t
		},
		e.prototype.getMaxStorage = function() {
			return this.maxStorage
		},
		e.prototype.setMaxStorage = function(t) {
			this.maxStorage = t
		},
		e.prototype.getMaxTwilightPoints = function() {
			return this.maxTwilightPoints
		},
		e.prototype.setMaxTwilightPoints = function(t) {
			this.maxTwilightPoints = t
		},
		e.prototype.getMaxZones = function() {
			return this.maxZones
		},
		e.prototype.setMaxZones = function(t) {
			this.maxZones = t
		},
		e.prototype.getNumGlyphs = function() {
			return this.numGlyphs
		},
		e.prototype.setNumGlyphs = function(t) {
			this.numGlyphs = t
		},
		e.prototype.getVersion = function() {
			return this.version
		},
		e.prototype.setVersion = function(t) {
			this.version = t
		},
		e.prototype.read = function(t, e) {
			this.version = e.read32Fixed(),
			this.numGlyphs = e.readUnsignedShort(),
			this.maxPoints = e.readUnsignedShort(),
			this.maxContours = e.readUnsignedShort(),
			this.maxCompositePoints = e.readUnsignedShort(),
			this.maxCompositeContours = e.readUnsignedShort(),
			this.maxZones = e.readUnsignedShort(),
			this.maxTwilightPoints = e.readUnsignedShort(),
			this.maxStorage = e.readUnsignedShort(),
			this.maxFunctionDefs = e.readUnsignedShort(),
			this.maxInstructionDefs = e.readUnsignedShort(),
			this.maxStackElements = e.readUnsignedShort(),
			this.maxSizeOfInstructions = e.readUnsignedShort(),
			this.maxComponentElements = e.readUnsignedShort(),
			this.maxComponentDepth = e.readUnsignedShort(),
			this.initialized = !0
		},
		e
	} (i.TTFTable);
	o.TAG = "maxp",
	e.MaximumProfileTable = o
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.read = function(t, e) {
			var n = t.getHorizontalHeader();
			this.numHMetrics = n.getNumberOfHMetrics();
			var r = t.getNumberOfGlyphs(),
			i = 0;
			this.advanceWidth = [],
			this.leftSideBearing = [];
			for (var o = 0; o < this.numHMetrics; o++) this.advanceWidth[o] = e.readUnsignedShort(),
			this.leftSideBearing[o] = e.readSignedShort(),
			i += 4;
			var s = r - this.numHMetrics;
			if (s < 0 && (s = r), this.nonHorizontalLeftSideBearing = [], i < this.getLength()) for (var o = 0; o < s; o++) i < this.getLength() && (this.nonHorizontalLeftSideBearing[o] = e.readSignedShort(), i += 2);
			this.initialized = !0
		},
		e.prototype.getAdvanceWidth = function(t) {
			return t < this.numHMetrics ? this.advanceWidth[t] : this.advanceWidth[this.advanceWidth.length - 1]
		},
		e.prototype.getLeftSideBearing = function(t) {
			return t < this.numHMetrics ? this.leftSideBearing[t] : this.nonHorizontalLeftSideBearing[t - this.numHMetrics]
		},
		e
	} (i.TTFTable);
	o.TAG = "hmtx",
	e.HorizontalMetricsTable = o
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.read = function(t, e) {
			this.version = e.read32Fixed(),
			this.ascender = e.readSignedShort(),
			this.descender = e.readSignedShort(),
			this.lineGap = e.readSignedShort(),
			this.advanceWidthMax = e.readUnsignedShort(),
			this.minLeftSideBearing = e.readSignedShort(),
			this.minRightSideBearing = e.readSignedShort(),
			this.xMaxExtent = e.readSignedShort(),
			this.caretSlopeRise = e.readSignedShort(),
			this.caretSlopeRun = e.readSignedShort(),
			this.reserved1 = e.readSignedShort(),
			this.reserved2 = e.readSignedShort(),
			this.reserved3 = e.readSignedShort(),
			this.reserved4 = e.readSignedShort(),
			this.reserved5 = e.readSignedShort(),
			this.metricDataFormat = e.readSignedShort(),
			this.numberOfHMetrics = e.readUnsignedShort(),
			this.initialized = !0
		},
		e.prototype.getAdvanceWidthMax = function() {
			return this.advanceWidthMax
		},
		e.prototype.setAdvanceWidthMax = function(t) {
			this.advanceWidthMax = t
		},
		e.prototype.getAscender = function() {
			return this.ascender
		},
		e.prototype.setAscender = function(t) {
			this.ascender = t
		},
		e.prototype.getCaretSlopeRise = function() {
			return this.caretSlopeRise
		},
		e.prototype.setCaretSlopeRise = function(t) {
			this.caretSlopeRise = t
		},
		e.prototype.getCaretSlopeRun = function() {
			return this.caretSlopeRun
		},
		e.prototype.setCaretSlopeRun = function(t) {
			this.caretSlopeRun = t
		},
		e.prototype.getDescender = function() {
			return this.descender
		},
		e.prototype.setDescender = function(t) {
			this.descender = t
		},
		e.prototype.getLineGap = function() {
			return this.lineGap
		},
		e.prototype.setLineGap = function(t) {
			this.lineGap = t
		},
		e.prototype.getMetricDataFormat = function() {
			return this.metricDataFormat
		},
		e.prototype.setMetricDataFormat = function(t) {
			this.metricDataFormat = t
		},
		e.prototype.getMinLeftSideBearing = function() {
			return this.minLeftSideBearing
		},
		e.prototype.setMinLeftSideBearing = function(t) {
			this.minLeftSideBearing = t
		},
		e.prototype.getMinRightSideBearing = function() {
			return this.minRightSideBearing
		},
		e.prototype.setMinRightSideBearing = function(t) {
			this.minRightSideBearing = t
		},
		e.prototype.getNumberOfHMetrics = function() {
			return this.numberOfHMetrics
		},
		e.prototype.setNumberOfHMetrics = function(t) {
			this.numberOfHMetrics = t
		},
		e.prototype.getReserved1 = function() {
			return this.reserved1
		},
		e.prototype.setReserved1 = function(t) {
			this.reserved1 = t
		},
		e.prototype.getReserved2 = function() {
			return this.reserved2
		},
		e.prototype.setReserved2 = function(t) {
			this.reserved2 = t
		},
		e.prototype.getReserved3 = function() {
			return this.reserved3
		},
		e.prototype.setReserved3 = function(t) {
			this.reserved3 = t
		},
		e.prototype.getReserved4 = function() {
			return this.reserved4
		},
		e.prototype.setReserved4 = function(t) {
			this.reserved4 = t
		},
		e.prototype.getReserved5 = function() {
			return this.reserved5
		},
		e.prototype.setReserved5 = function(t) {
			this.reserved5 = t
		},
		e.prototype.getVersion = function() {
			return this.version
		},
		e.prototype.setVersion = function(t) {
			this.version = t
		},
		e.prototype.getXMaxExtent = function() {
			return this.xMaxExtent
		},
		e.prototype.setXMaxExtent = function(t) {
			this.xMaxExtent = t
		},
		e
	} (i.TTFTable);
	o.TAG = "hhea",
	e.HorizontalHeaderTable = o
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.read = function(t, n) {
			for (var r = t.getHeader(), i = t.getNumberOfGlyphs(), o = this.offsets = [], s = r.getIndexToLocFormat(), a = 0; a < i + 1; a++) s == e.SHORT_OFFSETS ? o[a] = 2 * n.readUnsignedShort() : s == e.LONG_OFFSETS && (o[a] = n.readUnsignedInt());
			this.initialized = !0
		},
		e.prototype.getOffsets = function() {
			return this.offsets
		},
		e.prototype.setOffsets = function(t) {
			this.offsets = t
		},
		e
	} (i.TTFTable);
	o.SHORT_OFFSETS = 0,
	o.LONG_OFFSETS = 1,
	o.TAG = "loca",
	e.IndexToLocationTable = o
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.read = function(t, e) {
			this.version = e.read32Fixed(),
			this.fontRevision = e.read32Fixed(),
			this.checkSumAdjustment = e.readUnsignedInt(),
			this.magicNumber = e.readUnsignedInt(),
			this.flags = e.readUnsignedShort(),
			this.unitsPerEm = e.readUnsignedShort(),
			e.seek(e.getCurrentPosition() + 16),
			this.xMin = e.readSignedShort(),
			this.yMin = e.readSignedShort(),
			this.xMax = e.readSignedShort(),
			this.yMax = e.readSignedShort(),
			this.macStyle = e.readUnsignedShort(),
			this.lowestRecPPEM = e.readUnsignedShort(),
			this.fontDirectionHint = e.readSignedShort(),
			this.indexToLocFormat = e.readSignedShort(),
			this.glyphDataFormat = e.readSignedShort(),
			this.initialized = !0
		},
		e.prototype.getCheckSumAdjustment = function() {
			return this.checkSumAdjustment
		},
		e.prototype.setCheckSumAdjustment = function(t) {
			this.checkSumAdjustment = t
		},
		e.prototype.getFlags = function() {
			return this.flags
		},
		e.prototype.setFlags = function(t) {
			this.flags = t
		},
		e.prototype.getFontDirectionHint = function() {
			return this.fontDirectionHint
		},
		e.prototype.setFontDirectionHint = function(t) {
			this.fontDirectionHint = t
		},
		e.prototype.getFontRevision = function() {
			return this.fontRevision
		},
		e.prototype.setFontRevision = function(t) {
			this.fontRevision = t
		},
		e.prototype.getGlyphDataFormat = function() {
			return this.glyphDataFormat
		},
		e.prototype.setGlyphDataFormat = function(t) {
			this.glyphDataFormat = t
		},
		e.prototype.getIndexToLocFormat = function() {
			return this.indexToLocFormat
		},
		e.prototype.setIndexToLocFormat = function(t) {
			this.indexToLocFormat = t
		},
		e.prototype.getLowestRecPPEM = function() {
			return this.lowestRecPPEM
		},
		e.prototype.setLowestRecPPEM = function(t) {
			this.lowestRecPPEM = t
		},
		e.prototype.getMacStyle = function() {
			return this.macStyle
		},
		e.prototype.setMacStyle = function(t) {
			this.macStyle = t
		},
		e.prototype.getMagicNumber = function() {
			return this.magicNumber
		},
		e.prototype.setMagicNumber = function(t) {
			this.magicNumber = t
		},
		e.prototype.getUnitsPerEm = function() {
			return this.unitsPerEm
		},
		e.prototype.setUnitsPerEm = function(t) {
			this.unitsPerEm = t
		},
		e.prototype.getVersion = function() {
			return this.version
		},
		e.prototype.setVersion = function(t) {
			this.version = t
		},
		e.prototype.getXMax = function() {
			return this.xMax
		},
		e.prototype.setXMax = function(t) {
			this.xMax = t
		},
		e.prototype.getXMin = function() {
			return this.xMin
		},
		e.prototype.setXMin = function(t) {
			this.xMin = t
		},
		e.prototype.getYMax = function() {
			return this.yMax
		},
		e.prototype.setYMax = function(t) {
			this.yMax = t
		},
		e.prototype.getYMin = function() {
			return this.yMin
		},
		e.prototype.setYMin = function(t) {
			this.yMin = t
		},
		e
	} (i.TTFTable);
	o.TAG = "head",
	o.MAC_STYLE_BOLD = 1,
	o.MAC_STYLE_ITALIC = 2,
	e.HeaderTable = o
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.read = function(t, e) {
			this.version = e.read32Fixed(),
			this.ascender = e.readSignedShort(),
			this.descender = e.readSignedShort(),
			this.lineGap = e.readSignedShort(),
			this.advanceHeightMax = e.readUnsignedShort(),
			this.minTopSideBearing = e.readSignedShort(),
			this.minBottomSideBearing = e.readSignedShort(),
			this.yMaxExtent = e.readSignedShort(),
			this.caretSlopeRise = e.readSignedShort(),
			this.caretSlopeRun = e.readSignedShort(),
			this.caretOffset = e.readSignedShort(),
			this.reserved1 = e.readSignedShort(),
			this.reserved2 = e.readSignedShort(),
			this.reserved3 = e.readSignedShort(),
			this.reserved4 = e.readSignedShort(),
			this.metricDataFormat = e.readSignedShort(),
			this.numberOfVMetrics = e.readUnsignedShort(),
			this.initialized = !0
		},
		e.prototype.getAdvanceHeightMax = function() {
			return this.advanceHeightMax
		},
		e.prototype.getAscender = function() {
			return this.ascender
		},
		e.prototype.getCaretSlopeRise = function() {
			return this.caretSlopeRise
		},
		e.prototype.getCaretSlopeRun = function() {
			return this.caretSlopeRun
		},
		e.prototype.getCaretOffset = function() {
			return this.caretOffset
		},
		e.prototype.getDescender = function() {
			return this.descender
		},
		e.prototype.getLineGap = function() {
			return this.lineGap
		},
		e.prototype.getMetricDataFormat = function() {
			return this.metricDataFormat
		},
		e.prototype.getMinTopSideBearing = function() {
			return this.minTopSideBearing
		},
		e.prototype.getMinBottomSideBearing = function() {
			return this.minBottomSideBearing
		},
		e.prototype.getNumberOfVMetrics = function() {
			return this.numberOfVMetrics
		},
		e.prototype.getReserved1 = function() {
			return this.reserved1
		},
		e.prototype.getReserved2 = function() {
			return this.reserved2
		},
		e.prototype.getReserved3 = function() {
			return this.reserved3
		},
		e.prototype.getReserved4 = function() {
			return this.reserved4
		},
		e.prototype.getVersion = function() {
			return this.version
		},
		e.prototype.getYMaxExtent = function() {
			return this.yMaxExtent
		},
		e
	} (i.TTFTable);
	o.TAG = "vhea",
	e.VerticalHeaderTable = o
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = n(1),
	s = n(21),
	a = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.read = function(t, e) {
			if (this.formatType = e.read32Fixed(), this.italicAngle = e.read32Fixed(), this.underlinePosition = e.readSignedShort(), this.underlineThickness = e.readSignedShort(), this.isFixedPitch = e.readUnsignedInt(), this.minMemType42 = e.readUnsignedInt(), this.maxMemType42 = e.readUnsignedInt(), this.mimMemType1 = e.readUnsignedInt(), this.maxMemType1 = e.readUnsignedInt(), 1 == this.formatType) this.glyphNames = [],
			o.Util.arrayCopy(s.WGL4Names.MAC_GLYPH_NAMES, 0, this.glyphNames, 0, s.WGL4Names.NUMBER_OF_MAC_GLYPHS);
			else if (2 == this.formatType) {
				var n = e.readUnsignedShort(),
				r = [];
				this.glyphNames = [];
				for (var i = Number.MIN_VALUE,
				a = 0; a < n; a++) {
					var h = e.readUnsignedShort();
					r[a] = h,
					h <= 32767 && (i = Math.max(i, h))
				}
				var p = null;
				if (i >= s.WGL4Names.NUMBER_OF_MAC_GLYPHS) {
					p = [];
					for (var a = 0; a < i - s.WGL4Names.NUMBER_OF_MAC_GLYPHS + 1; a++) {
						var c = e.readUnsignedByte();
						p[a] = e.readString(c)
					}
				}
				for (var a = 0; a < n; a++) {
					var h = r[a];
					h < s.WGL4Names.NUMBER_OF_MAC_GLYPHS ? this.glyphNames[a] = s.WGL4Names.MAC_GLYPH_NAMES[h] : h >= s.WGL4Names.NUMBER_OF_MAC_GLYPHS && h <= 32767 ? this.glyphNames[a] = p[h - s.WGL4Names.NUMBER_OF_MAC_GLYPHS] : this.glyphNames[a] = ".undefined"
				}
			} else if (2.5 == this.formatType) {
				for (var r = [], a = 0; a < r.length; a++) {
					var u = e.readSignedByte();
					r[a] = a + 1 + u
				}
				this.glyphNames = [];
				for (var a = 0; a < this.glyphNames.length; a++) {
					var l = s.WGL4Names.MAC_GLYPH_NAMES[r[a]];
					null != l && (this.glyphNames[a] = l)
				}
			} else this.formatType;
			this.initialized = !0
		},
		e.prototype.getFormatType = function() {
			return this.formatType
		},
		e.prototype.setFormatType = function(t) {
			this.formatType = t
		},
		e.prototype.getIsFixedPitch = function() {
			return this.isFixedPitch
		},
		e.prototype.setIsFixedPitch = function(t) {
			this.isFixedPitch = t
		},
		e.prototype.getItalicAngle = function() {
			return this.italicAngle
		},
		e.prototype.setItalicAngle = function(t) {
			this.italicAngle = t
		},
		e.prototype.getMaxMemType1 = function() {
			return this.maxMemType1
		},
		e.prototype.setMaxMemType1 = function(t) {
			this.maxMemType1 = t
		},
		e.prototype.getMaxMemType42 = function() {
			return this.maxMemType42
		},
		e.prototype.setMaxMemType42 = function(t) {
			this.maxMemType42 = t
		},
		e.prototype.getMinMemType1 = function() {
			return this.mimMemType1
		},
		e.prototype.setMimMemType1 = function(t) {
			this.mimMemType1 = t
		},
		e.prototype.getMinMemType42 = function() {
			return this.minMemType42
		},
		e.prototype.setMinMemType42 = function(t) {
			this.minMemType42 = t
		},
		e.prototype.getUnderlinePosition = function() {
			return this.underlinePosition
		},
		e.prototype.setUnderlinePosition = function(t) {
			this.underlinePosition = t
		},
		e.prototype.getUnderlineThickness = function() {
			return this.underlineThickness
		},
		e.prototype.setUnderlineThickness = function(t) {
			this.underlineThickness = t
		},
		e.prototype.getGlyphNames = function() {
			return this.glyphNames
		},
		e.prototype.setGlyphNames = function(t) {
			this.glyphNames = t
		},
		e.prototype.getName = function(t) {
			return t < 0 || null == this.glyphNames || t >= this.glyphNames.length ? null: this.glyphNames[t]
		},
		e
	} (i.TTFTable);
	a.TAG = "post",
	e.PostScriptTable = a
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = n(22),
	s = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.read = function(t, n) {
			this.loca = t.getIndexToLocation(),
			this.numGlyphs = t.getNumberOfGlyphs(),
			this.numGlyphs < e.MAX_CACHE_SIZE && (this.glyphs = []),
			this.data = n,
			this.initialized = !0
		},
		e.prototype.getGlyphs = function() {
			var t = this.loca.getOffsets(),
			e = t[this.numGlyphs],
			n = this.getOffset();
			null == this.glyphs && (this.glyphs = []);
			for (var r = 0; r < this.numGlyphs && (0 == e || e != t[r]); r++) t[r + 1] <= t[r] || null == this.glyphs[r] && (this.data.seek(n + t[r]), null == this.glyphs[r] && ++this.cached, this.glyphs[r] = this.getGlyphData(r));
			return this.initialized = !0,
			this.glyphs
		},
		e.prototype.setGlyphs = function(t) {
			this.glyphs = t
		},
		e.prototype.getGlyph = function(t) {
			if (t < 0 || t >= this.numGlyphs) return null;
			if (null != this.glyphs && null != this.glyphs[t]) return this.glyphs[t];
			var n = this.loca.getOffsets();
			if (n[t] == n[t + 1]) return null;
			var r = this.data.getCurrentPosition();
			this.data.seek(this.getOffset() + n[t]);
			var i = this.getGlyphData(t);
			return this.data.seek(r),
			null != this.glyphs && null == this.glyphs[t] && this.cached < e.MAX_CACHED_GLYPHS && (this.glyphs[t] = i, ++this.cached),
			i
		},
		e.prototype.getGlyphData = function(t) {
			var e = new o.GlyphData,
			n = this.font.getHorizontalMetrics(),
			r = null == n ? 0 : n.getLeftSideBearing(t);
			return e.initData(this, this.data, r),
			e.getDescription().isComposite() && e.getDescription().resolve(),
			e
		},
		e
	} (i.TTFTable);
	s.TAG = "glyf",
	s.MAX_CACHE_SIZE = 5e3,
	s.MAX_CACHED_GLYPHS = 100,
	e.GlyphTable = s
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = function() {
		function t() {}
		return t
	} ();
	e.GeneralPath = r
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = n(28),
	s = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.read = function(t, e) {
			var n = (e.readUnsignedShort(), e.readUnsignedShort());
			e.readUnsignedShort();
			this.nameRecords = [];
			for (var r = 0; r < n; r++) {
				var i = new o.NameRecord;
				i.initData(t, e),
				this.nameRecords.push(i)
			}
			for (var s = 0,
			a = this.nameRecords; s < a.length; s++) {
				var i = a[s];
				if (i.getStringOffset() > this.getLength()) i.setString(null);
				else {
					e.seek(this.getOffset() + 6 + 2 * n * 6 + i.getStringOffset());
					var h = (i.getPlatformId(), i.getPlatformEncodingId(), e.readString(i.getStringLength()));
					i.setString(h)
				}
			}
			this.lookupTable = new Map;
			for (var p = 0,
			c = this.nameRecords; p < c.length; p++) {
				var i = c[p],
				u = this.lookupTable[i.getNameId()];
				null == u && (u = new Map, this.lookupTable.set(i.getNameId(), u));
				var l = u[i.getPlatformId()];
				null == l && (l = new Map, u.set(i.getPlatformId(), l));
				var d = l[i.getPlatformEncodingId()];
				null == d && (d = new Map, l.set(i.getPlatformEncodingId(), d)),
				d.set(i.getLanguageId(), i.getString())
			}
			this.fontFamily = this.getEnglishName(o.NameRecord.NAME_FONT_FAMILY_NAME),
			this.fontSubFamily = this.getEnglishName(o.NameRecord.NAME_FONT_SUB_FAMILY_NAME),
			this.psName = this.getName(o.NameRecord.NAME_POSTSCRIPT_NAME, o.NameRecord.PLATFORM_MACINTOSH, o.NameRecord.ENCODING_MACINTOSH_ROMAN, o.NameRecord.LANGUGAE_MACINTOSH_ENGLISH),
			null == this.psName && (this.psName = this.getName(o.NameRecord.NAME_POSTSCRIPT_NAME, o.NameRecord.PLATFORM_WINDOWS, o.NameRecord.ENCODING_WINDOWS_UNICODE_BMP, o.NameRecord.LANGUGAE_WINDOWS_EN_US)),
			null != this.psName && (this.psName = this.psName.trim()),
			this.initialized = !0
		},
		e.prototype.getEnglishName = function(t) {
			for (var e = 4; e >= 0; e--) {
				var n = this.getName(t, o.NameRecord.PLATFORM_UNICODE, e, o.NameRecord.LANGUGAE_UNICODE);
				if (null != n) return n
			}
			var r = this.getName(t, o.NameRecord.PLATFORM_WINDOWS, o.NameRecord.ENCODING_WINDOWS_UNICODE_BMP, o.NameRecord.LANGUGAE_WINDOWS_EN_US);
			if (null != r) return r;
			var i = this.getName(t, o.NameRecord.PLATFORM_MACINTOSH, o.NameRecord.ENCODING_MACINTOSH_ROMAN, o.NameRecord.LANGUGAE_MACINTOSH_ENGLISH);
			return null != i ? i: null
		},
		e.prototype.getName = function(t, e, n, r) {
			var i = this.lookupTable.get(t);
			if (null == i) return null;
			var o = i.get(e);
			if (null == o) return null;
			var s = o.get(n);
			return null == s ? null: s.get(r)
		},
		e.prototype.getNameRecords = function() {
			return this.nameRecords
		},
		e.prototype.getFontFamily = function() {
			return this.fontFamily
		},
		e.prototype.getFontSubFamily = function() {
			return this.fontSubFamily
		},
		e.prototype.getPostScriptName = function() {
			return this.psName
		},
		e
	} (i.TTFTable);
	s.TAG = "name",
	e.NamingTable = s
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = n(29),
	s = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.read = function(t, e) {
			for (var n = (e.readUnsignedShort(), e.readUnsignedShort()), r = [], i = 0; i < n; i++) {
				var s = new o.CmapSubtable;
				s.initData(e),
				r[i] = s
			}
			for (var i = 0; i < n; i++) r[i].initSubtable(this, t.getNumberOfGlyphs(), e);
			this.cmaps = r,
			this.initialized = !0
		},
		e.prototype.getCmaps = function() {
			return this.cmaps
		},
		e.prototype.setCmaps = function(t) {
			this.cmaps = t
		},
		e.prototype.getSubtable = function(t, e) {
			for (var n = this.cmaps,
			r = 0; r < n.length; r++) {
				var i = n[r];
				if (i.getPlatformId() == t && i.getPlatformEncodingId() == e) return i
			}
			return null
		},
		e
	} (i.TTFTable);
	s.TAG = "cmap",
	s.PLATFORM_UNICODE = 0,
	s.PLATFORM_MACINTOSH = 1,
	s.PLATFORM_WINDOWS = 3,
	s.ENCODING_MAC_ROMAN = 0,
	s.ENCODING_WIN_SYMBOL = 0,
	s.ENCODING_WIN_UNICODE_BMP = 1,
	s.ENCODING_WIN_SHIFT_JIS = 2,
	s.ENCODING_WIN_BIG5 = 3,
	s.ENCODING_WIN_PRC = 4,
	s.ENCODING_WIN_WANSUNG = 5,
	s.ENCODING_WIN_JOHAB = 6,
	s.ENCODING_WIN_UNICODE_FULL = 10,
	s.ENCODING_UNICODE_1_0 = 0,
	s.ENCODING_UNICODE_1_1 = 1,
	s.ENCODING_UNICODE_2_0_BMP = 3,
	s.ENCODING_UNICODE_2_0_FULL = 4,
	e.CmapTable = s
},
function(t, e, n) {
	"use strict";

	function r(t, e) {
		e || (e = window.location.href),
		t = t.replace(/[\[\]]/g, "\\$&");
		var n = new RegExp("[?&]" + t + "(=([^&#]*)|&|#|$)"),
		r = n.exec(e);
		return r ? r[2] ? decodeURIComponent(r[2].replace(/\+/g, " ")) : "": null
	}
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(17),
	o = n(39),
	s = function() {
		function t() {}
		return t.prototype.init = function() {
			var t = this;
			window.onresize = function() {
				t.updateToolbarPosition(),
				t.render.onWindowResize()
			},
			this.updateToolbarPosition();
			var e = this;
			document.onkeydown = function(t) {
				27 == t.keyCode && e.destroyCropper()
			},
			this.render = new o.Renderer,
			this.parser = new i.Parser,
			this.render.parser = this.parser,
			this.parser.renderer = this.render;
			var n = Math.max(document.body.clientHeight, document.documentElement.clientHeight) - 50;
			n < 50 && (n = 50),
			e.render.setWindowHeight(n);
			var s = window.location.search,
			a = r("w", s),
			h = r("file", s);
			if (window.ofdFile) {
				h = ofdFile;
			}
			h && (a && (this.render.watermarkInfo = JSON.parse(a)), this.parser.open(this.parser, this.render, h))
		},
		t.prototype.updateToolbarPosition = function() {
			var t = document.getElementById("toolbar-left"),
			e = document.getElementById("toolbar-right"),
			n = document.getElementById("toolbar-center"),
			r = (document.body.clientWidth - (t.clientWidth + e.clientWidth + n.clientWidth)) / 2 - 30;
			r < 0 && (r = 0),
			n.style.marginLeft = r + "px",
			n.style.marginRight = r + "px"
		},
		t.prototype.destroyCropper = function() {
			if (this.cropper) return this.cropper.destroy(),
			void(this.cropper = null)
		},
		t.prototype.print = function() {
			this.render.print(this.cropper)
		},
		t.prototype.previous = function() {
			this.render.previous()
		},
		t.prototype.next = function() {
			this.render.next()
		},
		t.prototype.zoomIn = function() {
			this.render.zoomIn()
		},
		t.prototype.zoomOut = function() {
			this.render.zoomOut()
		},
		t.prototype.zoom = function() {
			var t = parseFloat(document.getElementById("zoomValue").value);
			this.render.zoom(t, !0, !1),
			this.render.onscroll()
		},
		t.prototype.skipTo = function() {
			this.render.skipTo(null)
		},
		t.prototype.openFile = function() {
			this.render.openFile()
		},
		t.prototype.fullscreen = function() {
			this.render.fullscreen()
		},
		t.prototype.rotate = function() {
			this.render.rotate()
		},
		t.prototype.crop = function() {
			if (this.cropper) return this.cropper.destroy(),
			void(this.cropper = null);
			var t = this.render.doc.pages[this.render.currentPageNum].generatedImage;
			this.cropper = new Cropper(t, {
				autoCrop: !1,
				crop: function(t) {}
			})
		},
		t.prototype.showSideView = function() {
			var t = document.getElementById("sideviewcontainer"),
			e = document.getElementById("outlineContainer"),
			n = document.getElementById("customTagContainer");
			"none" == t.style.display || "block" == n.style.display ? (t.style.display = "block", e.style.display = "block", n.style.display = "none") : t.style.display = "none"
		},
		t.prototype.showTags = function() {
			var t = document.getElementById("sideviewcontainer"),
			e = document.getElementById("outlineContainer"),
			n = document.getElementById("customTagContainer");
			"none" == t.style.display || "block" == e.style.display ? (t.style.display = "block", e.style.display = "none", n.style.display = "block") : t.style.display = "none"
		},
		t
	} ();
	e.App = s;
	var a = new s;
	window.ofdreader = a,
	a.init(),
	$("#pageUpButton").click(function() {
		a.previous()
	}),
	$("#pageDownButton").click(function() {
		a.next()
	}),
	$("#pageNumb").on("change",
	function() {
		a.skipTo()
	}),
	$("#zoomInButton").click(function() {
		a.zoomIn()
	}),
	$("#zoomOutButton").click(function() {
		a.zoomOut()
	}),
	$("#zoomValue").on("change",
	function() {
		a.zoom()
	}),
	$("#showSideViewButton").click(function() {
		a.showSideView()
	}),
	$("#showTagsButton").click(function() {
		a.showTags()
	}),
	$("#openFile").click(function() {
		a.openFile()
	}),
	$("#cropButton").click(function() {
		a.crop()
	}),
	$("#btnPrint").click(function() {
		a.print()
	}),
	$("#contentContainer").dblclick(function() {
		a.fullscreen()
	})
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = n(3),
	i = n(1),
	o = n(18),
	s = n(4),
	a = n(38),
	h = function() {
		function t() {
			this.actions = [],
			this.annotation = [],
			this.pages = {}
		}
		return t.prototype.openData = function(t, e) {
			this.renderer = e;
			var n = this,
			r = new JSZip;
			r.loadAsync(t).then(function() {
				n.zip = r,
				n.parse()
			})
		},
		t.prototype.openForServerPrint = function(t, e) {
			this.serverPrintMode = !0,
			this.parseCompleted = e;
			var n = this;
			i.Util.open(t,
			function(t) {
				n.zip = t,
				n.parse()
			})
		},
		t.prototype.open = function(t, e, n) {
			this.renderer = e,
			i.Util.open(n,
			function(e) {
				t.zip = e,
				t.parse()
			})
		},
		t.prototype.parse = function() {
			var t = this.zip,
			e = this;
			this.doc = new r.Doc;
			var n = this.doc;
			t.files["OFD.xml"].async("string").then(function(r) {
				var i = (new DOMParser).parseFromString(r, "text/xml").documentElement;
				n.init(i),
				t.files[n.docRootPath].async("string").then(function(t) {
					n.doc = (new DOMParser).parseFromString(t, "text/xml").documentElement,
					e.parseDocument()
				})
			})
		},
		t.prototype.readXml = function(t, e) {
			return this.zip.files[t].async("string").then(function(t) {
				var n = new DOMParser,
				r = n.parseFromString(t, "text/xml");
				e(r.documentElement)
			})
		},
		t.prototype.parseColor = function(t) {
			t || (t = "255 255 255");
			var e = t.split(" ");
			return 1 == e.length ? "rgb(" + e[0] + "," + e[0] + "," + e[0] + ")": "rgb(" + t.split(" ").join(",") + ")"
		},
		t.prototype.parseValue = function(t, e) {
			return renderScaleDefault * parseFloat(t.getAttribute(e))
		},
		t.prototype.parseRawValue = function(t, e) {
			return parseFloat(t.getAttribute(e))
		},
		t.prototype.parseValues = function(t) {
			if (t) {
				for (var e = [], n = t.length, r = 0, i = 0; i <= n; i++) i !== n && 32 !== t.charCodeAt(i) || (e[e.length] = renderScaleDefault * parseFloat(t.substring(r, i)), r = i + 1);
				return e
			}
			return null
		},
		t.prototype.parseRawValues = function(t) {
			if (t) {
				for (var e = [], n = t.length, r = 0, i = 0; i <= n; i++) i !== n && 32 !== t.charCodeAt(i) || (e[e.length] = parseFloat(t.substring(r, i)), r = i + 1);
				return e
			}
			return null
		},
		t.prototype.parseCTMValues = function(t) {
			if (t) {
				for (var e = [], n = t.length, r = 0, i = 0; i <= n; i++) i !== n && 32 !== t.charCodeAt(i) || (e[e.length] = parseFloat(t.substring(r, i)), r = i + 1);
				return e
			}
			return null
		},
		t.prototype.parseDocument = function() {
			var t, e, n = this,
			i = this.doc,
			s = i.doc,
			h = s.childNodes;
			for (t = 0; t < h.length; t++) {
				var p = h[t],
				c = void 0;
				switch (p.localName) {
				case "CommonData":
					for (c = p.childNodes, e = 0; e < c.length; e++) switch (p = c[e], p.localName) {
					case "PageArea":
						if (null == (p = p.firstElementChild)) break;
						"PhysicalBox" == p.localName && (i.physicalBox = this.parseValues(p.textContent));
						break;
					case "PublicRes":
						i.publicRes = p.textContent;
						break;
					case "DocumentRes":
						i.documentRes = p.textContent
					}
					break;
				case "Pages":
					c = p.childNodes;
					for (e = 0; e < c.length; e++) if (p = c[e], "Page" == p.localName) {
						var u = new r.Page;
						u.id = p.getAttribute("ID"),
						u.path = p.getAttribute("BaseLoc"),
						this.pages[u.id] = u,
						i.pages.push(u)
					}
					this.serverPrintMode || (this.renderer.pageCount = 0);
					break;
				case "Outlines":
					this.serverPrintMode || (i.outlines = new o.OutlineView, i.outlines.parse(p, this.renderer));
					break;
				case "CustomTags":
					this.serverPrintMode || (i.customTags = new a.CustomTagsView, i.customTags.parse(p, this, this.renderer));
					break;
				case "Annotations":
					this.serverPrintMode || (i.annotationFile = p.textContent)
				}
			}
			for (var l = this,
			d = i.pages,
			f = d.length,
			g = f,
			y = this,
			m = 0; m < f; m++) !
			function(t) {
				var e = d[t],
				n = e.path;
				i.dir && (n = i.dir + n),
				e.index = t,
				y.readXml(n,
				function(t) {
					e.element = t,
					g--
				})
			} (m);
			i.publicRes && (g++, this.readXml(i.dir + i.publicRes,
			function(t) {
				var e = {};
				e.element = t,
				i.publicRes = e,
				g--
			})),
			i.documentRes && (g++, this.readXml(i.dir + i.documentRes,
			function(t) {
				var e = {};
				e.element = t,
				i.documentRes = e,
				g--
			})),
			i.annotationFile && (g++, this.readXml(i.dir + i.annotationFile,
			function(t) {
				for (var e = t.childNodes,
				r = e.length,
				o = {},
				s = 0; s < r; s++) !
				function(t) {
					var r = e.item(t);
					if (1 != r.nodeType) return "continue";
					switch (r.localName) {
					case "Page":
						var s = Object.create(null);
						s.pageId = r.getAttribute("PageID"),
						s.fileLocation = r.firstElementChild.textContent,
						o[s.pageId] = s;
						var a = parseInt(s.pageId);
						g++,
						n.readXml(i.dir + s.fileLocation,
						function(t) {
							n.parseAnnotationFiles(t, a),
							s.el = t,
							g--
						})
					}
				} (s);
				i.annotations = o,
				g--
			}));
			var v = setInterval(function() {
				g || (clearInterval(v), l.parsePages())
			},
			5)
		},
		t.prototype.parseAnnotationFiles = function(t, e) {
			for (var n = t.childNodes,
			r = n.length,
			o = this.parseAppearance,
			s = i.Util.attr,
			a = [], h = 0; h < r; h++) {
				var p = n.item(h);
				if (1 == p.nodeType) switch (p.localName) {
				case "Annot":
					var c = Object.create(null);
					c.boundary = this.parseValues(p.getAttribute("Boundary"));
					var u = Object.create(null);
					u.objects = [],
					c.Appearance = u,
					s(c, p);
					var l = p.lastElementChild;
					c.boundary || (c.boundary = this.parseValues(l.getAttribute("Boundary"))),
					o.call(this, u, l, e),
					a.push(c)
				}
			}
			this.annotation.push(a)
		},
		t.prototype.parsePages = function() {
			this.parsePublicRes(),
			this.parseDocumentRes();
			for (var t = this.doc.annotations,
			e = this.doc.pages,
			n = e.length,
			r = 0; r < n; r++) if (this.parsePage(r, !1), t) {
				var i = t[e[r].id];
				i && (e[r].annotations = this.annotation[r])
			}
			this.serverPrintMode || this.renderer.init(this.doc, this);
			var o = this;
			s.FontEngine.parseAllFonts(o,
			function() {
				o.serverPrintMode ? o.parseCompleted() : o.renderer.repaint()
			})
		},
		t.prototype.parseAppearance = function(t, e, n) {
			for (var r = e.childNodes,
			i = r.length,
			o = 0; o < i; o++) {
				var s = r.item(o),
				a = null;
				switch (s.localName) {
				case "PageBlock":
					this.parseAppearance(t, s, n);
					break;
				case "PathObject":
					a = this.pPathObject(s);
					break;
				case "TextObject":
					a = this.pTextObject(s, this.pages[n]);
					break;
				case "ImageObject":
					var h = this.doc.imageIds;
					if (a = this.pImageObject(s)) {
						var p = a.resourceID;
						p && (h[p] || (h[p] = new Image)),
						a.img = h[p],
						this.pages[n].images.push(a)
					}
				}
				a && t.objects.push(a)
			}
		},
		t.prototype.parsePublicRes = function() {
			var t = this.doc;
			if (t.publicRes) {
				var e, n, r, i, o = t.publicRes,
				a = o.element.childNodes;
				for (e = 0; e < a.length; e++) if (r = a[e], "Fonts" == r.localName) for (i = r.childNodes, n = 0; n < i.length; n++) if (r = i[n], "Font" == r.localName) {
					var h = Object.create(null);
					h.ID = r.getAttribute("ID"),
					h.name = r.getAttribute("FontName"),
					o[h.ID] = h;
					var p = r.firstElementChild;
					p && (h.file = p.textContent, s.FontEngine.add(h));
					var c = h.name,
					u = c.indexOf("+"); - 1 != u && (c = c.substring(u + 1)),
					c && (h.name = c)
				}
			}
		},
		t.prototype.parseDocumentRes = function() {
			var t = this.doc;
			if (t.documentRes) {
				var e, n, r, i, o, s = t.documentRes,
				a = s.element.childNodes;
				for (e = 0; e < a.length; e++) if (r = a[e], "MultiMedias" == r.localName) for (i = r.childNodes, n = 0; n < i.length; n++) if (r = i[n], "MultiMedia" == r.localName && (o = r.getAttribute("ID"))) {
					var h = r.getAttribute("Type");
					r = r.firstElementChild,
					r && "MediaFile" == r.localName && (s[o] = [h, r.textContent])
				}
			}
		},
		t.prototype.parsePath2 = function(t) {
			for (var e = [], n = t.split(" "), r = n.length, i = parseFloat, o = 0; o < r; o++) switch (n[o]) {
			case "M":
				e.push(0, renderScaleDefault * i(n[o + 1]), renderScaleDefault * i(n[o + 2])),
				o += 2;
				break;
			case "L":
				e.push(1, renderScaleDefault * i(n[o + 1]), renderScaleDefault * i(n[o + 2])),
				o += 2;
				break;
			case "S":
				e.push(2, renderScaleDefault * i(n[o + 1]), renderScaleDefault * i(n[o + 2])),
				o += 2;
				break;
			case "B":
				e.push(3, renderScaleDefault * i(n[o + 1]), renderScaleDefault * i(n[o + 2]), renderScaleDefault * i(n[o + 3]), renderScaleDefault * i(n[o + 4]), renderScaleDefault * i(n[o + 5]), renderScaleDefault * i(n[o + 6])),
				o += 6;
				break;
			case "Q":
				e.push(4, renderScaleDefault * i(n[o + 1]), renderScaleDefault * i(n[o + 2]), renderScaleDefault * i(n[o + 3]), renderScaleDefault * i(n[o + 4])),
				o += 4;
				break;
			case "C":
				e.push(5);
				break;
			case "A":
				e.push(6, i(n[o + 1]), i(n[o + 2]), i(n[o + 3]), i(n[o + 4]), i(n[o + 5]), i(n[o + 6]), i(n[o + 7])),
				o += 7
			}
			return e
		},
		t.prototype.pCTM = function(t, e) {
			var n = this.parseValues(e.getAttribute("CTM"));
			n && 6 === n.length && (1 !== n[0] || n[1] || n[2] || 1 !== n[3] || n[4] || n[5]) && (t.CTM = n)
		},
		t.prototype.pCTM2 = function(t, e) {
			var n = this.parseRawValues(e.getAttribute("CTM"));
			return n && 6 === n.length && (1 !== n[0] || n[1] || n[2] || 1 !== n[3] || n[4] || n[5]) && (n[4] = renderScaleDefault * n[4], n[5] = renderScaleDefault * n[5], t.CTM = n),
			n
		},
		t.prototype.pPathObject = function(t) {
			var e = new r.PathObj;
			e.type = 1,
			e.id = parseInt(t.getAttribute("ID")),
			e.boundary = this.parseValues(t.getAttribute("Boundary"));
			var n = t.getAttribute("Alpha");
			n && (e.alpha = parseInt(n) / 255),
			"true" == t.getAttribute("Stroke") && (e.stroke = 1),
			"true" == t.getAttribute("Fill") && (e.fill = 1);
			var i = t.getAttribute("LineWidth");
			i && (e.lineWidth = parseFloat(i));
			for (var o = t.childNodes,
			s = 0; s < o.length; s++) {
				var a = o[s];
				if (1 == a.nodeType) switch (a.localName) {
				case "FillColor":
					e.fillColor = this.parseColor(a.getAttribute("Value"));
					break;
				case "StrokeColor":
					e.strokeColor = this.parseColor(a.getAttribute("Value"));
					break;
				case "AbbreviatedData":
					e.abbreviatedData = this.parsePath2(a.textContent);
					break;
				case "Actions":
					var h = a.firstElementChild;
					if (h) {
						if ("CLICK" == h.getAttribute("Event")) {
							var p = h.firstElementChild.getAttribute("URI");
							e.url = p,
							e.movieID = h.firstElementChild.getAttribute("ResourceID"),
							this.actions.push(e)
						}
					}
					break;
				case "Clips":
					e.clips = [],
					this.parseClips(a, e.clips);
					break;
				default:
					console.log("todo", a.localName)
				}
			}
			return ! e.fill && e.fillColor && (e.fill = 1),
			!e.stroke && e.strokeColor && (e.stroke = 1),
			e
		},
		t.prototype.pTextObject = function(t, e) {
			var n = new r.TextObj;
			n.type = 2,
			n.id = parseInt(t.getAttribute("ID")),
			n.boundary = this.parseValues(t.getAttribute("Boundary")),
			n.font = t.getAttribute("Font");
			var i = t.getAttribute("Alpha");
			i && (n.alpha = parseInt(i) / 255),
			"true" == t.getAttribute("Stroke") && (n.stroke = !0),
			"true" == t.getAttribute("Fill") && (n.fill = !0);
			this.pCTM2(n, t);
			n.size = 1 * this.parseValue(t, "Size"),
			"true" == t.getAttribute("Italic") && (n.italic = 1);
			var o = this.parseValue(t, "Weight");
			o && o > 400 && (n.bold = 1);
			for (var s, a = t.childNodes,
			h = 0; h < a.length; h++) switch (t = a[h], t.localName) {
			case "CGTransform":
				n.cg = this.parseCGTransform(t);
				break;
			case "FillColor":
				n.fillColor = this.parseColor(t.getAttribute("Value"));
				break;
			case "StrokeColor":
				n.strokeColor = this.parseColor(t.getAttribute("Value"));
				break;
			case "TextCode":
				var p = t.getAttribute("DeltaX");
				if (p && (n.deltax = this.parseValues(p), n.CTM)) for (var c = 0; c < n.deltax.length; c++) n.deltax[c] = n.deltax[c] * n.CTM[0];
				s ? s += t.textContent: (s = t.textContent, e.allText += s, n.x = this.parseValue(t, "X"), n.y = this.parseValue(t, "Y"), n.CTM && (n.x = n.x * n.CTM[0] + n.CTM[4], n.y = n.y * n.CTM[3] + n.CTM[5]), isNaN(n.x) && (n.x = 0), isNaN(n.y) && (n.y = 0));
				break;
			case "Clips":
				n.clips = [],
				this.parseClips(t, n.clips)
			}
			return n.textCode = s,
			!n.fill && n.fillColor && (n.fill = !0),
			!n.stroke && n.strokeColor && (n.stroke = !0),
			n
		},
		t.prototype.parseCGTransform = function(t) {
			var e = Object.create(null);
			e.CodeCount = parseInt(t.getAttribute("CodeCount")),
			e.CodePosition = parseInt(t.getAttribute("CodePosition"));
			var n = e.GlyphCount = parseInt(t.getAttribute("GlyphCount"));
			if (n > 0) {
				for (var r = t.firstElementChild,
				i = r.textContent.split(" "), o = [], s = 0; s < n; s++) o[s] = Number(i[s]);
				e.glyphIds = o
			}
			return e
		},
		t.prototype.pImageObject = function(t) {
			var e = new r.ImageObj;
			if (e.type = 3, e.id = parseInt(t.getAttribute("ID")), e.resourceID = t.getAttribute("ResourceID")) {
				e.boundary = this.parseValues(t.getAttribute("Boundary")),
				this.pCTM(e, t);
				for (var n = e.clips = [], i = t.childNodes, o = 0; o < i.length; o++) t = i[o],
				"Clips" == t.localName && this.parseClips(t, n)
			}
			return e
		},
		t.prototype.parseClips = function(t, e) {
			for (var n = t.childNodes,
			r = 0; r < n.length; r++) {
				var i = n[r];
				if ("Clip" == i.localName) for (var o = i.childNodes,
				s = 0; s < o.length; s++) if (i = o[s], "Area" == i.localName) for (var a = i.childNodes,
				h = 0; h < a.length; h++) if (i = a[h], "Path" == i.localName) for (var p = i.childNodes,
				c = 0; c < p.length; c++) i = p[c],
				"AbbreviatedData" == i.localName && (e[e.length] = this.parsePath2(i.textContent))
			}
		},
		t.prototype.parsePage = function(t, e) {
			void 0 === e && (e = !0);
			for (var n = this.doc.pages[t], r = n.element.childNodes, i = 0; i < r.length; i++) {
				var o = r[i];
				switch (o.localName) {
				case "Area":
					for (var s = o.childNodes,
					a = 0; a < s.length; a++) o = s[a],
					"PhysicalBox" == o.localName && (n.physicalBox = this.parseValues(o.textContent));
					break;
				case "Content":
					n.content = o,
					this.parsePageContent(n)
				}
			}
		},
		t.prototype.parsePageContent = function(t) {
			var e = this.doc.imageIds;
			if (t.content) {
				for (var n = t.layers = [], r = t.content.childNodes, i = 0; i < r.length; i++) {
					var o = r[i];
					if ("Layer" == o.localName) {
						var s = this.createLayer(o);
						n.push(s),
						this.parseBlockContent(t, o, s, e)
					}
				}
				for (var a = void 0,
				h = void 0,
				p = n.length - 1; p > 0;) {
					a = 1;
					var o = n[0];
					for (h = 0; h < p; h++) {
						var c = n[h + 1];
						o.type > c.type ? (n[h] = c, n[h + 1] = o, p > 1 && (a = 0)) : o = c
					}
					if (a) break
				}
				delete t.content
			}
		},
		t.prototype.parseBlockContent = function(t, e, n, r) {
			for (var i = e.childNodes,
			o = i.length,
			s = 0; s < o; s++) {
				var a = i.item(s),
				h = null;
				switch (a.localName) {
				case "PageBlock":
					this.parseBlockContent(t, a, n, r);
					break;
				case "PathObject":
					h = this.pPathObject(a);
					break;
				case "TextObject":
					h = this.pTextObject(a, t);
					break;
				case "ImageObject":
					if (h = this.pImageObject(a)) {
						var p = h.resourceID;
						p && (r[p] || (r[p] = new Image)),
						h.img = r[p],
						t.images.push(h)
					}
				}
				h && n.objects.push(h)
			}
		},
		t.prototype.createLayer = function(t) {
			var e = 0;
			switch (t.getAttribute("Type")) {
			case "Foreground":
				e = 1;
				break;
			case "Background":
				e = -1
			}
			var n = new r.Layer;
			return n.type = e,
			n
		},
		t.prototype.getResFile = function(t, e) {
			var n = this.doc.documentRes ? this.doc.documentRes[t] : 0;
			if (n) {
				var r = this.doc.dir + "Res/" + n[1];
				this.zip.files[r].async("blob").then(function(t) {
					e(t)
				})
			}
		},
		t.prototype.getFilePath = function(t) {
			var e = this.doc.documentRes ? this.doc.documentRes[t] : 0;
			if (e) {
				return this.doc.dir + "Res/" + e[1]
			}
		},
		t
	} ();
	e.Parser = h
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = function() {
		function t() {}
		return t.prototype.parse = function(t, e) {
			this.render = e;
			var n = document.getElementById("outlineContainer");
			n.innerHTML = "";
			for (var r = Object.create(null), i = (r.children = [], t.childNodes), o = i.length, s = this.parseOutlineElement, a = 0; a < o; a++) {
				var h = i.item(a);
				if (h.nodeType == Node.ELEMENT_NODE) switch (h.localName) {
				case "OutlineElem":
					s.call(this, r, h)
				}
			}
			for (var p = document.createElement("ul"), c = 0; c < r.children.length; c++) {
				var u = r.children[c];
				if (u.children) {
					var l = document.createElement("ul"),
					d = document.createElement("li");
					d.innerText = u.title,
					d.setAttribute("data-pageid", u.pageId);
					for (var a = 0; a < u.children.length; a++) {
						var f = document.createElement("li"),
						g = u.children[a];
						if (f.textContent = g.title, f.setAttribute("data-pageid", g.pageId), l.appendChild(f), g.children) for (var y = 0; y < g.children.length; y++) {
							var m = g.children[y],
							v = document.createElement("ul"),
							S = document.createElement("li");
							S.innerText = m.title,
							S.setAttribute("data-pageid", m.pageId),
							v.appendChild(S),
							f.appendChild(v)
						}
					}
					d.appendChild(l),
					p.appendChild(d)
				} else {
					var C = document.createElement("li");
					C.innerText = u.title,
					C.setAttribute("data-pageid", u.pageId),
					p.appendChild(C)
				}
			}
			n.innerHTML = "";
			var b = document.createElement("div");
			b.appendChild(p),
			n.appendChild(b),
			$(b).jstree(),
			$(b).on("changed.jstree",
			function(t, n) {
				var r = n.node.data.pageid;
				e.skipTo(r)
			})
		},
		t.prototype.parseOutlineElement = function(t, e) {
			var n = Object.create(null);
			n.title = e.getAttribute("Title"),
			t.children || (t.children = []),
			t.children.push(n);
			for (var r = e.childNodes,
			i = r.length,
			o = (this.parseOutlineElement, 0); o < i; o++) {
				var s = r.item(o);
				if (s.nodeType == Node.ELEMENT_NODE) switch (s.localName) {
				case "OutlineElem":
					this.parseOutlineElement(n, s);
					break;
				case "Actions":
					var a = s.firstElementChild.firstElementChild.firstElementChild;
					n.pageId = a.getAttribute("PageID")
				}
			}
			return n
		},
		t
	} ();
	e.OutlineView = r
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = n(20),
	i = n(0),
	o = n(15),
	s = n(30),
	a = n(31),
	h = n(10),
	p = n(32),
	c = n(34),
	u = n(11),
	l = n(35),
	d = n(14),
	f = n(5),
	g = n(9),
	y = n(7),
	m = n(6),
	v = n(8),
	S = n(12),
	C = function() {
		function t(t, e) {
			this.isEmbedded = !1,
			this.parseOnDemandOnly = !1,
			this.isEmbedded = t,
			this.parseOnDemandOnly = e
		}
		return t.prototype.parse = function(t) {
			var e = this.newFont(t);
			e.setVersion(t.read32Fixed());
			for (var n = t.readUnsignedShort(), r = (t.readUnsignedShort(), t.readUnsignedShort(), t.readUnsignedShort(), 0); r < n; r++) {
				var i = this.readTableDirectory(e, t);
				null != i && e.addTable(i)
			}
			return this.parseOnDemandOnly || this.parseTables(e),
			e
		},
		t.prototype.newFont = function(t) {
			return new r.TrueTypeFont(t)
		},
		t.prototype.readTableDirectory = function(t, e) {
			var n, r = e.readString(4);
			return n = r == o.CmapTable.TAG ? new o.CmapTable(t) : r == S.GlyphTable.TAG ? new S.GlyphTable(t) : r == g.HeaderTable.TAG ? new g.HeaderTable(t) : r == y.HorizontalHeaderTable.TAG ? new y.HorizontalHeaderTable(t) : r == m.HorizontalMetricsTable.TAG ? new m.HorizontalMetricsTable(t) : r == v.IndexToLocationTable.TAG ? new v.IndexToLocationTable(t) : r == f.MaximumProfileTable.TAG ? new f.MaximumProfileTable(t) : r == d.NamingTable.TAG ? new d.NamingTable(t) : r == l.OS2WindowsMetricsTable.TAG ? new l.OS2WindowsMetricsTable(t) : r == u.PostScriptTable.TAG ? new u.PostScriptTable(t) : r == c.DigitalSignatureTable.TAG ? new c.DigitalSignatureTable(t) : r == p.KerningTable.TAG ? new p.KerningTable(t) : r == h.VerticalHeaderTable.TAG ? new h.VerticalHeaderTable(t) : r == a.VerticalMetricsTable.TAG ? new a.VerticalMetricsTable(t) : r == s.VerticalOriginTable.TAG ? new s.VerticalOriginTable(t) : this.readTable(t, r),
			n.setTag(r),
			n.setCheckSum(e.readUnsignedInt()),
			n.setOffset(e.readUnsignedInt()),
			n.setLength(e.readUnsignedInt()),
			0 == n.getLength() && r != S.GlyphTable.TAG ? null: n
		},
		t.prototype.parseTables = function(t) {
			t.getTables().forEach(function(e, n, r) {
				e.getInitialized() || t.readTable(e)
			});
			var e = this.allowCFF();
			t.getHeader(),
			t.getHorizontalHeader(),
			t.getMaximumProfile(),
			t.getPostScript();
			if (!e) {
				t.getIndexToLocation()
			} (null != t.getNaming() || this.isEmbedded) && t.getHorizontalMetrics()
		},
		t.prototype.readTable = function(t, e) {
			return new i.TTFTable(t)
		},
		t.prototype.allowCFF = function() {
			return ! 1
		},
		t
	} ();
	e.TTFParser = C
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = n(5),
	i = n(6),
	o = n(7),
	s = n(8),
	a = n(9),
	h = n(10),
	p = n(11),
	c = n(12),
	u = n(14),
	l = n(15),
	d = function() {
		function t(t) {
			this.numberOfGlyphs = -1,
			this.unitsPerEm = -1,
			this.tables = new Map,
			this.data = t
		}
		return t.prototype.newFont = function(e) {
			return new t(e)
		},
		t.prototype.setVersion = function(t) {
			this.version = t
		},
		t.prototype.addTable = function(t) {
			this.tables.set(t.getTag(), t)
		},
		t.prototype.getNumberOfGlyphs = function() {
			if ( - 1 == this.numberOfGlyphs) {
				var t = this.getMaximumProfile();
				this.numberOfGlyphs = null != t ? t.getNumGlyphs() : 0
			}
			return this.numberOfGlyphs
		},
		t.prototype.getMaximumProfile = function() {
			return this.getTable(r.MaximumProfileTable.TAG)
		},
		t.prototype.getTable = function(t) {
			var e = this.tables.get(t);
			return null == e || e.getInitialized() || this.readTable(e),
			e
		},
		t.prototype.readTable = function(t) {
			var e = this.data.getCurrentPosition();
			this.data.seek(t.getOffset()),
			t.read(this, this.data),
			this.data.seek(e)
		},
		t.prototype.getHorizontalMetrics = function() {
			return this.getTable(i.HorizontalMetricsTable.TAG)
		},
		t.prototype.getIndexToLocation = function() {
			return this.getTable(s.IndexToLocationTable.TAG)
		},
		t.prototype.getHorizontalHeader = function() {
			return this.getTable(o.HorizontalHeaderTable.TAG)
		},
		t.prototype.getHeader = function() {
			return this.getTable(a.HeaderTable.TAG)
		},
		t.prototype.getVerticalHeader = function() {
			return this.getTable(h.VerticalHeaderTable.TAG)
		},
		t.prototype.getTables = function() {
			return this.tables
		},
		t.prototype.getPostScript = function() {
			return this.getTable(p.PostScriptTable.TAG)
		},
		t.prototype.getGlyph = function() {
			return this.getTable(c.GlyphTable.TAG)
		},
		t.prototype.getName = function() {
			return null != this.getNaming() ? this.getNaming().getPostScriptName() : null
		},
		t.prototype.getNaming = function() {
			return this.getTable(u.NamingTable.TAG)
		},
		t.prototype.getCmap = function() {
			return this.getTable(l.CmapTable.TAG)
		},
		t
	} ();
	e.TrueTypeFont = d
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = function() {
		function t() {}
		return t.init = function() {
			for (var e = new Map,
			n = t.MAC_GLYPH_NAMES,
			r = t.NUMBER_OF_MAC_GLYPHS,
			i = 0; i < r; ++i) e.set(n[i], i);
			t.MAC_GLYPH_NAMES_INDICES = e
		},
		t
	} ();
	r.NUMBER_OF_MAC_GLYPHS = 258,
	r.MAC_GLYPH_NAMES = [".notdef", ".null", "nonmarkingreturn", "space", "exclam", "quotedbl", "numbersign", "dollar", "percent", "ampersand", "quotesingle", "parenleft", "parenright", "asterisk", "plus", "comma", "hyphen", "period", "slash", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "colon", "semicolon", "less", "equal", "greater", "question", "at", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "bracketleft", "backslash", "bracketright", "asciicircum", "underscore", "grave", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "braceleft", "bar", "braceright", "asciitilde", "Adieresis", "Aring", "Ccedilla", "Eacute", "Ntilde", "Odieresis", "Udieresis", "aacute", "agrave", "acircumflex", "adieresis", "atilde", "aring", "ccedilla", "eacute", "egrave", "ecircumflex", "edieresis", "iacute", "igrave", "icircumflex", "idieresis", "ntilde", "oacute", "ograve", "ocircumflex", "odieresis", "otilde", "uacute", "ugrave", "ucircumflex", "udieresis", "dagger", "degree", "cent", "sterling", "section", "bullet", "paragraph", "germandbls", "registered", "copyright", "trademark", "acute", "dieresis", "notequal", "AE", "Oslash", "infinity", "plusminus", "lessequal", "greaterequal", "yen", "mu", "partialdiff", "summation", "product", "pi", "integral", "ordfeminine", "ordmasculine", "Omega", "ae", "oslash", "questiondown", "exclamdown", "logicalnot", "radical", "florin", "approxequal", "Delta", "guillemotleft", "guillemotright", "ellipsis", "nonbreakingspace", "Agrave", "Atilde", "Otilde", "OE", "oe", "endash", "emdash", "quotedblleft", "quotedblright", "quoteleft", "quoteright", "divide", "lozenge", "ydieresis", "Ydieresis", "fraction", "currency", "guilsinglleft", "guilsinglright", "fi", "fl", "daggerdbl", "periodcentered", "quotesinglbase", "quotedblbase", "perthousand", "Acircumflex", "Ecircumflex", "Aacute", "Edieresis", "Egrave", "Iacute", "Icircumflex", "Idieresis", "Igrave", "Oacute", "Ocircumflex", "apple", "Ograve", "Uacute", "Ucircumflex", "Ugrave", "dotlessi", "circumflex", "tilde", "macron", "breve", "dotaccent", "ring", "cedilla", "hungarumlaut", "ogonek", "caron", "Lslash", "lslash", "Scaron", "scaron", "Zcaron", "zcaron", "brokenbar", "Eth", "eth", "Yacute", "yacute", "Thorn", "thorn", "minus", "multiply", "onesuperior", "twosuperior", "threesuperior", "onehalf", "onequarter", "threequarters", "franc", "Gbreve", "gbreve", "Idotaccent", "Scedilla", "scedilla", "Cacute", "cacute", "Ccaron", "ccaron", "dcroat"],
	e.WGL4Names = r
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = n(23),
	i = n(24),
	o = n(25),
	s = n(27),
	a = function() {
		function t() {}
		return t.prototype.initData = function(t, e, n) {
			if (this.numberOfContours = e.readSignedShort(), this.xMin = e.readSignedShort(), this.yMin = e.readSignedShort(), this.xMax = e.readSignedShort(), this.yMax = e.readSignedShort(), this.boundingBox = new r.BoundingBox(this.xMin, this.yMin, this.xMax, this.yMax), this.numberOfContours >= 0) {
				var s = n - this.xMin;
				this.glyphDescription = new i.GlyfSimpleDescript(this.numberOfContours, e, s)
			} else this.glyphDescription = new o.GlyfCompositeDescript(e, t)
		},
		t.prototype.getBoundingBox = function() {
			return this.boundingBox
		},
		t.prototype.setBoundingBox = function(t) {
			this.boundingBox = t
		},
		t.prototype.getNumberOfContours = function() {
			return this.numberOfContours
		},
		t.prototype.setNumberOfContours = function(t) {
			this.numberOfContours = t
		},
		t.prototype.getDescription = function() {
			return this.glyphDescription
		},
		t.prototype.getPath = function() {
			return new s.GlyphRenderer(this.glyphDescription).getPath()
		},
		t.prototype.getXMaximum = function() {
			return this.xMax
		},
		t.prototype.getXMinimum = function() {
			return this.xMin
		},
		t.prototype.getYMaximum = function() {
			return this.yMax
		},
		t.prototype.getYMinimum = function() {
			return this.yMin
		},
		t
	} ();
	e.GlyphData = a
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = function() {
		function t(t, e, n, r) {
			this.lowerLeftX = t,
			this.lowerLeftY = e,
			this.upperRightX = n,
			this.upperRightY = r
		}
		return t.prototype.getLowerLeftX = function() {
			return this.lowerLeftX
		},
		t.prototype.setLowerLeftX = function(t) {
			this.lowerLeftX = t
		},
		t.prototype.getLowerLeftY = function() {
			return this.lowerLeftY
		},
		t.prototype.setLowerLeftY = function(t) {
			this.lowerLeftY = t
		},
		t.prototype.getUpperRightX = function() {
			return this.upperRightX
		},
		t.prototype.setUpperRightX = function(t) {
			this.upperRightX = t
		},
		t.prototype.getUpperRightY = function() {
			return this.upperRightY
		},
		t.prototype.setUpperRightY = function(t) {
			this.upperRightY = t
		},
		t.prototype.getWidth = function() {
			return this.getUpperRightX() - this.getLowerLeftX()
		},
		t.prototype.getHeight = function() {
			return this.getUpperRightY() - this.getLowerLeftY()
		},
		t.prototype.contains = function(t, e) {
			return t >= this.lowerLeftX && t <= this.upperRightX && e >= this.lowerLeftY && e <= this.upperRightY
		},
		t.prototype.toString = function() {
			return "[" + this.getLowerLeftX() + "," + this.getLowerLeftY() + "," + this.getUpperRightX() + "," + this.getUpperRightY() + "]"
		},
		t
	} ();
	e.BoundingBox = r
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(2),
	o = function(t) {
		function e(e, n, r) {
			var i = t.call(this, e, n) || this;
			if (0 == e) return i.pointCount = 0,
			i;
			i.endPtsOfContours = n.readUnsignedShortArray(e);
			var o = i.endPtsOfContours[e - 1];
			if (1 == e && 65535 == o) return i.pointCount = 0,
			i;
			i.pointCount = o + 1,
			i.flags = new Uint8Array(i.pointCount),
			i.xCoordinates = [],
			i.yCoordinates = [];
			var s = n.readUnsignedShort();
			return i.readInstructions(n, s),
			i.readFlags(i.pointCount, n),
			i.readCoords(i.pointCount, n, r),
			i
		}
		return r(e, t),
		e.prototype.getEndPtOfContours = function(t) {
			return this.endPtsOfContours[t]
		},
		e.prototype.getFlags = function(t) {
			return this.flags[t]
		},
		e.prototype.getXCoordinate = function(t) {
			return this.xCoordinates[t]
		},
		e.prototype.getYCoordinate = function(t) {
			return this.yCoordinates[t]
		},
		e.prototype.isComposite = function() {
			return ! 1
		},
		e.prototype.getPointCount = function() {
			return this.pointCount
		},
		e.prototype.readCoords = function(t, n, r) {
			for (var i = r,
			o = 0,
			s = 0; s < t; s++) 0 != (this.flags[s] & e.X_DUAL) ? 0 != (this.flags[s] & e.X_SHORT_VECTOR) && (i += n.readUnsignedByte()) : 0 != (this.flags[s] & e.X_SHORT_VECTOR) ? i += -n.readUnsignedByte() : i += n.readSignedShort(),
			this.xCoordinates[s] = i;
			for (var s = 0; s < t; s++) 0 != (this.flags[s] & e.Y_DUAL) ? 0 != (this.flags[s] & e.Y_SHORT_VECTOR) && (o += n.readUnsignedByte()) : 0 != (this.flags[s] & e.Y_SHORT_VECTOR) ? o += -n.readUnsignedByte() : o += n.readSignedShort(),
			this.yCoordinates[s] = o
		},
		e.prototype.readFlags = function(t, n) {
			for (var r = 0; r < t; r++) if (this.flags[r] = n.readUnsignedByte(), 0 != (this.flags[r] & e.REPEAT)) {
				for (var i = n.readUnsignedByte(), o = 1; o <= i; o++) this.flags[r + o] = this.flags[r];
				r += i
			}
		},
		e
	} (i.GlyfDescript);
	e.GlyfSimpleDescript = o
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(2),
	o = n(26),
	s = function(t) {
		function e(e, n) {
			var r = t.call(this, -1, e) || this;
			r.pointCount = -1,
			r.contourCount = -1,
			r.glyphTable = n;
			var i;
			r.components = [];
			do {
				i = new o.GlyfCompositeComp(e), r.components.push(i)
			} while ( 0 != ( i . getFlags () & o.GlyfCompositeComp.MORE_COMPONENTS));
			return 0 != (i.getFlags() & o.GlyfCompositeComp.WE_HAVE_INSTRUCTIONS) && r.readInstructions(e, e.readUnsignedShort()),
			r.initDescriptions(),
			r
		}
		return r(e, t),
		e.prototype.resolve = function() {
			if (!this.resolved && !this.beingResolved) {
				this.beingResolved = !0;
				for (var t = 0,
				e = 0,
				n = 0,
				r = this.components; n < r.length; n++) {
					var i = r[n];
					i.setFirstIndex(t),
					i.setFirstContour(e);
					var o = this.descriptions.get(i.getGlyphIndex());
					null != o && (o.resolve(), t += o.getPointCount(), e += o.getContourCount())
				}
				this.resolved = !0,
				this.beingResolved = !1
			}
		},
		e.prototype.getEndPtOfContours = function(t) {
			var e = this.getCompositeCompEndPt(t);
			if (null != e) {
				return this.descriptions.get(e.getGlyphIndex()).getEndPtOfContours(t - e.getFirstContour()) + e.getFirstIndex()
			}
			return 0
		},
		e.prototype.getFlags = function(t) {
			var e = this.getCompositeComp(t);
			if (null != e) {
				return this.descriptions.get(e.getGlyphIndex()).getFlags(t - e.getFirstIndex())
			}
			return 0
		},
		e.prototype.getXCoordinate = function(t) {
			var e = this.getCompositeComp(t);
			if (null != e) {
				var n = this.descriptions.get(e.getGlyphIndex()),
				r = t - e.getFirstIndex(),
				i = n.getXCoordinate(r),
				o = n.getYCoordinate(r),
				s = e.scaleX(i, o);
				return s += e.getXTranslate()
			}
			return 0
		},
		e.prototype.getYCoordinate = function(t) {
			var e = this.getCompositeComp(t);
			if (null != e) {
				var n = this.descriptions.get(e.getGlyphIndex()),
				r = t - e.getFirstIndex(),
				i = n.getXCoordinate(r),
				o = n.getYCoordinate(r),
				s = e.scaleY(i, o);
				return s += e.getYTranslate()
			}
			return 0
		},
		e.prototype.isComposite = function() {
			return ! 0
		},
		e.prototype.getPointCount = function() {
			if (this.resolved, this.pointCount < 0) {
				var t = this.components[this.components.length - 1],
				e = this.descriptions.get(t.getGlyphIndex());
				this.pointCount = null == e ? 0 : t.getFirstIndex() + e.getPointCount()
			}
			return this.pointCount
		},
		e.prototype.getContourCount = function() {
			if (this.resolved, this.contourCount < 0) {
				var t = this.components[this.components.length - 1];
				this.contourCount = t.getFirstContour() + this.descriptions.get(t.getGlyphIndex()).getContourCount()
			}
			return this.contourCount
		},
		e.prototype.getComponentCount = function() {
			return this.components.length
		},
		e.prototype.getCompositeComp = function(t) {
			for (var e = 0,
			n = this.components; e < n.length; e++) {
				var r = n[e],
				i = this.descriptions.get(r.getGlyphIndex());
				if (r.getFirstIndex() <= t && null != i && t < r.getFirstIndex() + i.getPointCount()) return r
			}
			return null
		},
		e.prototype.getCompositeCompEndPt = function(t) {
			for (var e = 0,
			n = this.components; e < n.length; e++) {
				var r = n[e],
				i = this.descriptions.get(r.getGlyphIndex());
				if (r.getFirstContour() <= t && null != i && t < r.getFirstContour() + i.getContourCount()) return r
			}
			return null
		},
		e.prototype.initDescriptions = function() {
			for (var t = this.descriptions = new Map,
			e = 0,
			n = this.components; e < n.length; e++) {
				var r = n[e],
				i = r.getGlyphIndex(),
				o = this.glyphTable.getGlyph(i);
				null != o && t.set(i, o.getDescription())
			}
		},
		e
	} (i.GlyfDescript);
	e.GlyfCompositeDescript = s
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = function() {
		function t(e) {
			if (this.xscale = 1, this.yscale = 1, this.scale01 = 0, this.scale10 = 0, this.xtranslate = 0, this.ytranslate = 0, this.point1 = 0, this.point2 = 0, this.flags = e.readSignedShort(), this.glyphIndex = e.readUnsignedShort(), 0 != (this.flags & t.ARG_1_AND_2_ARE_WORDS) ? (this.argument1 = e.readSignedShort(), this.argument2 = e.readSignedShort()) : (this.argument1 = e.readSignedByte(), this.argument2 = e.readSignedByte()), 0 != (this.flags & t.ARGS_ARE_XY_VALUES) ? (this.xtranslate = this.argument1, this.ytranslate = this.argument2) : (this.point1 = this.argument1, this.point2 = this.argument2), 0 != (this.flags & t.WE_HAVE_A_SCALE)) {
				var n = e.readSignedShort();
				this.xscale = this.yscale = n / 16384
			} else if (0 != (this.flags & t.WE_HAVE_AN_X_AND_Y_SCALE)) {
				var n = e.readSignedShort();
				this.xscale = n / 16384,
				n = e.readSignedShort(),
				this.yscale = n / 16384
			} else if (0 != (this.flags & t.WE_HAVE_A_TWO_BY_TWO)) {
				var n = e.readSignedShort();
				this.xscale = n / 16384,
				n = e.readSignedShort(),
				this.scale01 = n / 16384,
				n = e.readSignedShort(),
				this.scale10 = n / 16384,
				n = e.readSignedShort(),
				this.yscale = n / 16384
			}
		}
		return t.prototype.setFirstIndex = function(t) {
			this.firstIndex = t
		},
		t.prototype.getFirstIndex = function() {
			return this.firstIndex
		},
		t.prototype.setFirstContour = function(t) {
			this.firstContour = t
		},
		t.prototype.getFirstContour = function() {
			return this.firstContour
		},
		t.prototype.getArgument1 = function() {
			return this.argument1
		},
		t.prototype.getArgument2 = function() {
			return this.argument2
		},
		t.prototype.getFlags = function() {
			return this.flags
		},
		t.prototype.getGlyphIndex = function() {
			return this.glyphIndex
		},
		t.prototype.getScale01 = function() {
			return this.scale01
		},
		t.prototype.getScale10 = function() {
			return this.scale10
		},
		t.prototype.getXScale = function() {
			return this.xscale
		},
		t.prototype.getYScale = function() {
			return this.yscale
		},
		t.prototype.getXTranslate = function() {
			return this.xtranslate
		},
		t.prototype.getYTranslate = function() {
			return this.ytranslate
		},
		t.prototype.scaleX = function(t, e) {
			return Math.round(t * this.xscale + e * this.scale10)
		},
		t.prototype.scaleY = function(t, e) {
			return Math.round(t * this.scale01 + e * this.yscale)
		},
		t
	} ();
	r.ARG_1_AND_2_ARE_WORDS = 1,
	r.ARGS_ARE_XY_VALUES = 2,
	r.ROUND_XY_TO_GRID = 4,
	r.WE_HAVE_A_SCALE = 8,
	r.MORE_COMPONENTS = 32,
	r.WE_HAVE_AN_X_AND_Y_SCALE = 64,
	r.WE_HAVE_A_TWO_BY_TWO = 128,
	r.WE_HAVE_INSTRUCTIONS = 256,
	r.USE_MY_METRICS = 512,
	e.GlyfCompositeComp = r
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = n(13),
	i = n(2),
	o = function() {
		function t(t) {
			this.glyphDescription = t
		}
		return t.prototype.getPath = function() {
			var t = this.describe(this.glyphDescription);
			return this.calculatePath(t)
		},
		t.prototype.describe = function(t) {
			for (var e = 0,
			n = -1,
			r = [], o = 0; o < t.getPointCount(); o++) { - 1 == n && (n = t.getEndPtOfContours(e));
				var a = n == o;
				a && (e++, n = -1),
				r[o] = new s(t.getXCoordinate(o), t.getYCoordinate(o), 0 != (t.getFlags(o) & i.GlyfDescript.ON_CURVE), a)
			}
			return r
		},
		t.prototype.calculatePath = function(t) {
			for (var e = new r.GeneralPath,
			n = e.data = [], i = 0, o = 0, s = t.length; o < s; ++o) if (t[o].endOfContour) {
				for (var a = t[i], h = t[o], p = [], c = i; c <= o; ++c) p.push(t[c]);
				if (t[i].onCurve) p.push(a);
				else if (t[o].onCurve) p.splice(0, 0, h);
				else {
					var u = this.midValue(a, h);
					p.splice(0, 0, u),
					p.push(u)
				}
				this.moveTo(n, p[0]);
				for (var l = 1,
				d = p.length; l < d; l++) {
					var f = p[l];
					f.onCurve ? this.lineTo(n, f) : p[l + 1].onCurve ? (this.quadTo(n, f, p[l + 1]), ++l) : this.quadTo(n, f, this.midValue(f, p[l + 1]))
				}
				n.push(5),
				i = o + 1
			}
			return e
		},
		t.prototype.moveTo = function(t, e) {
			t.push(0),
			t.push(e.x, e.y)
		},
		t.prototype.lineTo = function(t, e) {
			t.push(1),
			t.push(e.x, e.y)
		},
		t.prototype.quadTo = function(t, e, n) {
			t.push(4),
			t.push(e.x, e.y, n.x, n.y)
		},
		t.prototype.midValue = function(t, e) {
			return new s(this.midValue1(t.x, e.x), this.midValue1(t.y, e.y), !0, !1)
		},
		t.prototype.midValue1 = function(t, e) {
			return t + (e - t) / 2
		},
		t
	} ();
	e.GlyphRenderer = o;
	var s = function() {
		function t(t, e, n, r) {
			this.x = 0,
			this.y = 0,
			this.onCurve = !0,
			this.endOfContour = !1,
			this.x = t,
			this.y = e,
			this.onCurve = n,
			this.endOfContour = r
		}
		return t
	} ();
	e.Point = s
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = function() {
		function t() {}
		return t.prototype.getStringLength = function() {
			return this.stringLength
		},
		t.prototype.setStringLength = function(t) {
			this.stringLength = t
		},
		t.prototype.getStringOffset = function() {
			return this.stringOffset
		},
		t.prototype.setStringOffset = function(t) {
			this.stringOffset = t
		},
		t.prototype.getLanguageId = function() {
			return this.languageId
		},
		t.prototype.setLanguageId = function(t) {
			this.languageId = t
		},
		t.prototype.getNameId = function() {
			return this.nameId
		},
		t.prototype.setNameId = function(t) {
			this.nameId = t
		},
		t.prototype.getPlatformEncodingId = function() {
			return this.platformEncodingId
		},
		t.prototype.setPlatformEncodingId = function(t) {
			this.platformEncodingId = t
		},
		t.prototype.getPlatformId = function() {
			return this.platformId
		},
		t.prototype.setPlatformId = function(t) {
			this.platformId = t
		},
		t.prototype.initData = function(t, e) {
			this.platformId = e.readUnsignedShort(),
			this.platformEncodingId = e.readUnsignedShort(),
			this.languageId = e.readUnsignedShort(),
			this.nameId = e.readUnsignedShort(),
			this.stringLength = e.readUnsignedShort(),
			this.stringOffset = e.readUnsignedShort()
		},
		t.prototype.toString = function() {
			return "platform=" + this.platformId + " pEncoding=" + this.platformEncodingId + " language=" + this.languageId + " name=" + this.nameId + " " + this.string
		},
		t.prototype.getString = function() {
			return this.string
		},
		t.prototype.setString = function(t) {
			this.string = t
		},
		t
	} ();
	r.PLATFORM_UNICODE = 0,
	r.PLATFORM_MACINTOSH = 1,
	r.PLATFORM_ISO = 2,
	r.PLATFORM_WINDOWS = 3,
	r.ENCODING_UNICODE_1_0 = 0,
	r.ENCODING_UNICODE_1_1 = 1,
	r.ENCODING_UNICODE_2_0_BMP = 3,
	r.ENCODING_UNICODE_2_0_FULL = 4,
	r.LANGUGAE_UNICODE = 0,
	r.ENCODING_WINDOWS_SYMBOL = 0,
	r.ENCODING_WINDOWS_UNICODE_BMP = 1,
	r.ENCODING_WINDOWS_UNICODE_UCS4 = 10,
	r.LANGUGAE_WINDOWS_EN_US = 1033,
	r.ENCODING_MACINTOSH_ROMAN = 0,
	r.LANGUGAE_MACINTOSH_ENGLISH = 0,
	r.NAME_COPYRIGHT = 0,
	r.NAME_FONT_FAMILY_NAME = 1,
	r.NAME_FONT_SUB_FAMILY_NAME = 2,
	r.NAME_UNIQUE_FONT_ID = 3,
	r.NAME_FULL_FONT_NAME = 4,
	r.NAME_VERSION = 5,
	r.NAME_POSTSCRIPT_NAME = 6,
	r.NAME_TRADEMARK = 7,
	e.NameRecord = r
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = function() {
		function t() {}
		return t.prototype.initData = function(t) {
			this.platformId = t.readUnsignedShort(),
			this.platformEncodingId = t.readUnsignedShort(),
			this.subTableOffset = t.readUnsignedInt()
		},
		t.prototype.initSubtable = function(t, e, n) {
			n.seek(t.getOffset() + this.subTableOffset);
			var r = n.readUnsignedShort();
			switch (r < 8 ? (n.readUnsignedShort(), n.readUnsignedShort()) : (n.readUnsignedShort(), n.readUnsignedInt(), n.readUnsignedInt()), r) {
			case 0:
				this.processSubtype0(n);
				break;
			case 2:
				this.processSubtype2(n, e);
				break;
			case 4:
				this.processSubtype4(n, e);
				break;
			case 6:
				this.processSubtype6(n, e);
				break;
			case 8:
				this.processSubtype8(n, e);
				break;
			case 10:
				this.processSubtype10(n, e);
				break;
			case 12:
				this.processSubtype12(n, e);
				break;
			case 13:
				this.processSubtype13(n, e);
				break;
			case 14:
				this.processSubtype14(n, e)
			}
		},
		t.prototype.processSubtype8 = function(e, n) {
			var r = e.readUnsignedByteArray(8192),
			i = e.readUnsignedInt();
			if (! (i > 65536)) {
				this.glyphIdToCharacterCode = this.newGlyphIdToCharacterCode(n),
				this.characterCodeToGlyphId = new Map;
				for (var o = 0; o < i; ++o) {
					var s = e.readUnsignedInt(),
					a = e.readUnsignedInt(),
					h = e.readUnsignedInt();
					if (s > a || 0 > s) return;
					for (var p = s; p <= a; ++p) {
						var c = void 0;
						if (0 == (r[p / 8] & 1 << p % 8)) c = p;
						else {
							c = (t.LEAD_OFFSET + (p >> 10) << 10) + (56320 + (1023 & p)) + t.SURROGATE_OFFSET
						}
						var u = h + (p - s);
						this.glyphIdToCharacterCode[u] = c,
						this.characterCodeToGlyphId.set(c, u)
					}
				}
			}
		},
		t.prototype.processSubtype10 = function(t, e) {
			t.readUnsignedInt(),
			t.readUnsignedInt();
			Number.MAX_VALUE
		},
		t.prototype.processSubtype12 = function(t, e) {
			var n = t.readUnsignedInt();
			this.glyphIdToCharacterCode = this.newGlyphIdToCharacterCode(e),
			this.characterCodeToGlyphId = new Map;
			for (var r = 0; r < n; ++r) {
				var i = t.readUnsignedInt(),
				o = t.readUnsignedInt(),
				s = t.readUnsignedInt();
				if (i < 0 || i > 1114111 || i >= 55296 && i <= 57343) return;
				if (o > 0 && o < i || o > 1114111 || o >= 55296 && o <= 57343) return;
				for (var a = 0; a <= o - i; ++a) {
					var h = s + a;
					if (h >= e) break;
					this.glyphIdToCharacterCode[h] = i + a,
					this.characterCodeToGlyphId.set(i + a, h)
				}
			}
		},
		t.prototype.processSubtype13 = function(t, e) {
			var n = t.readUnsignedInt();
			this.characterCodeToGlyphId = new Map;
			for (var r = 0; r < n; ++r) {
				var i = t.readUnsignedInt(),
				o = t.readUnsignedInt(),
				s = t.readUnsignedInt();
				if (s > e) break;
				for (var a = 0; a <= o - i; ++a) {
					if (i + a > Number.MAX_VALUE) return;
					this.glyphIdToCharacterCode[s] = i + a,
					this.characterCodeToGlyphId.set(i + a, s)
				}
			}
		},
		t.prototype.processSubtype14 = function(t, e) {},
		t.prototype.processSubtype6 = function(t, e) {
			var n = t.readUnsignedShort(),
			r = t.readUnsignedShort();
			if (0 != r) {
				this.characterCodeToGlyphId = new Map;
				for (var i = t.readUnsignedShortArray(r), o = 0, s = 0; s < r; s++) o = Math.max(o, i[s]),
				this.characterCodeToGlyphId.set(n + s, i[s]);
				this.buildGlyphIdToCharacterCodeLookup(o)
			}
		},
		t.prototype.processSubtype4 = function(t, e) {
			var n = t.readUnsignedShort(),
			r = n / 2,
			i = (t.readUnsignedShort(), t.readUnsignedShort(), t.readUnsignedShort(), t.readUnsignedShortArray(r)),
			o = (t.readUnsignedShort(), t.readUnsignedShortArray(r)),
			s = t.readUnsignedShortArray(r),
			a = t.getCurrentPosition(),
			h = t.readUnsignedShortArray(r);
			this.characterCodeToGlyphId = new Map;
			for (var p = 0,
			c = 0; c < r; c++) {
				var u = o[c],
				l = i[c],
				d = s[c],
				f = h[c],
				g = a + 2 * c + f;
				if (65535 != u && 65535 != l) for (var y = u; y <= l; y++) if (0 == f) {
					var m = y + d & 65535;
					p = Math.max(m, p),
					this.characterCodeToGlyphId.set(y, m)
				} else {
					var v = g + 2 * (y - u);
					t.seek(v);
					var S = t.readUnsignedShort();
					0 != S && (S = S + d & 65535, p = Math.max(S, p), this.characterCodeToGlyphId.set(y, S))
				}
			}
			this.characterCodeToGlyphId.size < 1 || this.buildGlyphIdToCharacterCodeLookup(p)
		},
		t.prototype.buildGlyphIdToCharacterCodeLookup = function(t) {
			this.glyphIdToCharacterCode = this.newGlyphIdToCharacterCode(t + 1);
			for (var e in this.characterCodeToGlyphId) if ( - 1 == this.glyphIdToCharacterCode[this.characterCodeToGlyphId[e]]) this.glyphIdToCharacterCode[this.characterCodeToGlyphId[e]] = Number(e);
			else {
				var n = this.glyphIdToCharacterCodeMultiple.get(this.characterCodeToGlyphId[e]);
				null == n && (n = new Array, this.glyphIdToCharacterCodeMultiple.set(this.characterCodeToGlyphId[e], n), n.push(this.glyphIdToCharacterCode[this.characterCodeToGlyphId[e]]), this.glyphIdToCharacterCode[this.characterCodeToGlyphId[e]] = Number.MIN_VALUE),
				n.push(Number(e))
			}
		},
		t.prototype.processSubtype2 = function(t, e) {
			for (var n = [], r = 0, o = 0; o < 256; o++) n[o] = t.readUnsignedShort(),
			r = Math.max(r, n[o] / 8);
			for (var s = [], o = 0; o <= r; ++o) {
				var a = t.readUnsignedShort(),
				h = t.readUnsignedShort(),
				p = t.readSignedShort(),
				c = t.readUnsignedShort() - 8 * (r + 1 - o - 1) - 2;
				s[o] = new i(a, h, p, c)
			}
			var u = t.getCurrentPosition();
			this.glyphIdToCharacterCode = this.newGlyphIdToCharacterCode(e),
			this.characterCodeToGlyphId = new Map;
			for (var o = 0; o <= r; ++o) {
				var l = s[o],
				a = l.getFirstCode(),
				c = l.getIdRangeOffset(),
				p = l.getIdDelta(),
				h = l.getEntryCount();
				t.seek(u + c);
				for (var d = 0; d < h; ++d) {
					var f = o;
					f = (f << 8) + (a + d);
					var g = t.readUnsignedShort();
					g > 0 && (g = (g + p) % 65536),
					g >= e || (this.glyphIdToCharacterCode[g] = f, this.characterCodeToGlyphId.set(f, g))
				}
			}
		},
		t.prototype.processSubtype0 = function(t) {
			var e = t.read1(256);
			this.glyphIdToCharacterCode = this.newGlyphIdToCharacterCode(256),
			this.characterCodeToGlyphId = new Map;
			for (var n = 0; n < e.length; n++) {
				var r = 255 & e[n];
				this.glyphIdToCharacterCode[r] = n,
				this.characterCodeToGlyphId.set(n, r)
			}
		},
		t.prototype.newGlyphIdToCharacterCode = function(t) {
			var e = [];
			return this.fill(e, -1),
			e
		},
		t.prototype.fill = function(t, e) {
			for (var n = 0,
			r = t.length; n < r; n++) t[n] = e
		},
		t.prototype.getPlatformEncodingId = function() {
			return this.platformEncodingId
		},
		t.prototype.setPlatformEncodingId = function(t) {
			this.platformEncodingId = t
		},
		t.prototype.getPlatformId = function() {
			return this.platformId
		},
		t.prototype.setPlatformId = function(t) {
			this.platformId = t
		},
		t.prototype.getGlyphId = function(t) {
			var e = this.characterCodeToGlyphId.get(t);
			return null == e ? 0 : e
		},
		t.prototype.getCharacterCode = function(t) {
			var e = this.getCharCode(t);
			if ( - 1 == e) return null;
			if (e == Number.MIN_VALUE) {
				var n = this.glyphIdToCharacterCodeMultiple.get(t);
				if (null != n) return n[0]
			}
			return e
		},
		t.prototype.getCharCode = function(t) {
			return t < 0 || t >= this.glyphIdToCharacterCode.length ? -1 : this.glyphIdToCharacterCode[t]
		},
		t.prototype.getCharCodes = function(t) {
			var e = this.getCharCode(t);
			if ( - 1 == e) return null;
			var n = null;
			if (e == Number.MIN_VALUE) {
				null != this.glyphIdToCharacterCodeMultiple.get(t) && (n = new Array, n.sort())
			} else n = new Array,
			n.add(e);
			return n
		},
		t.prototype.toString = function() {
			return "{" + this.getPlatformId() + " " + this.getPlatformEncodingId() + "}"
		},
		t
	} ();
	r.LEAD_OFFSET = 55232,
	r.SURROGATE_OFFSET = -56613888,
	e.CmapSubtable = r;
	var i = function() {
		function t(t, e, n, r) {
			this.firstCode = t,
			this.entryCount = e,
			this.idDelta = n,
			this.idRangeOffset = r
		}
		return t.prototype.getFirstCode = function() {
			return this.firstCode
		},
		t.prototype.getEntryCount = function() {
			return this.entryCount
		},
		t.prototype.getIdDelta = function() {
			return this.idDelta
		},
		t.prototype.getIdRangeOffset = function() {
			return this.idRangeOffset
		},
		t
	} ();
	e.SubHeader = i
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.read = function(t, e) {
			this.version = e.read32Fixed(),
			this.defaultVertOriginY = e.readSignedShort();
			var n = e.readUnsignedShort();
			this.origins = new Map;
			for (var r = 0; r < n; ++r) {
				var i = e.readUnsignedShort(),
				o = e.readSignedShort();
				this.origins.set(i, o)
			}
			this.initialized = !0
		},
		e.prototype.getVersion = function() {
			return this.version
		},
		e.prototype.getOriginY = function(t) {
			return this.origins.has(t) ? this.origins.get(t) : this.defaultVertOriginY
		},
		e
	} (i.TTFTable);
	o.TAG = "VORG",
	e.VerticalOriginTable = o
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.read = function(t, e) {
			var n = t.getVerticalHeader();
			this.numVMetrics = n.getNumberOfVMetrics();
			var r = t.getNumberOfGlyphs(),
			i = 0;
			this.advanceHeight = [],
			this.topSideBearing = [];
			for (var o = 0; o < this.numVMetrics; o++) this.advanceHeight[o] = e.readUnsignedShort(),
			this.topSideBearing[o] = e.readSignedShort(),
			i += 4;
			if (i < this.getLength()) {
				var s = r - this.numVMetrics;
				s < 0 && (s = r),
				this.nonVerticalTopSideBearing = [];
				for (var o = 0; o < s; o++) i < this.getLength() && (this.nonVerticalTopSideBearing[o] = e.readSignedShort(), i += 2)
			}
			this.initialized = !0
		},
		e.prototype.getAdvanceHeight = function(t) {
			return t < this.numVMetrics ? this.advanceHeight[t] : this.advanceHeight[this.advanceHeight.length - 1]
		},
		e
	} (i.TTFTable);
	o.TAG = "vmtx",
	e.VerticalMetricsTable = o
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(33),
	o = n(0),
	s = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.read = function(t, e) {
			var n = e.readUnsignedShort();
			0 != n && (n = n << 16 | e.readUnsignedShort());
			var r = 0;
			if (0 == n ? r = e.readUnsignedShort() : 1 == n && (r = e.readUnsignedInt()), r > 0) {
				this.subtables = [];
				for (var o = 0; o < r; ++o) {
					var s = new i.KerningSubtable;
					s.read(e, n),
					this.subtables[o] = s
				}
			}
			this.initialized = !0
		},
		e.prototype.getHorizontalKerningSubtable = function(t) {
			if (null != this.subtables) for (var e = 0,
			n = this.subtables; e < n.length; e++) {
				var r = n[e];
				if (r.isHorizontalKerning(t)) return r
			}
			return null
		},
		e
	} (o.TTFTable);
	s.TAG = "kern",
	e.KerningTable = s
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = n(1),
	i = function() {
		function t() {}
		return t.prototype.read = function(t, e) {
			if (0 == e) this.readSubtable0(t);
			else {
				if (1 != e) throw new DOMException;
				this.readSubtable1(t)
			}
		},
		t.prototype.isHorizontalKerning = function(t) {
			return !! this.horizontal && (!this.minimums && (t ? this.crossStream: !this.crossStream))
		},
		t.prototype.getKerning1 = function(t) {
			var e = null;
			if (null != this.pairs) {
				var n = t.length;
				e = [];
				for (var r = 0; r < n; ++r) {
					for (var i = t[r], o = -1, s = r + 1; s < n; ++s) {
						var a = t[s];
						if (a >= 0) {
							o = a;
							break
						}
					}
					e[r] = this.getKerning(i, o)
				}
			}
			return e
		},
		t.prototype.getKerning = function(t, e) {
			return null == this.pairs ? 0 : this.pairs.getKerning(t, e)
		},
		t.prototype.readSubtable0 = function(e) {
			if (0 == e.readUnsignedShort()) {
				var n = (e.readUnsignedShort(), e.readUnsignedShort());
				t.isBitsSet(n, t.COVERAGE_HORIZONTAL, t.COVERAGE_HORIZONTAL_SHIFT) && (this.horizontal = !0),
				t.isBitsSet(n, t.COVERAGE_MINIMUMS, t.COVERAGE_MINIMUMS_SHIFT) && (this.minimums = !0),
				t.isBitsSet(n, t.COVERAGE_CROSS_STREAM, t.COVERAGE_CROSS_STREAM_SHIFT) && (this.crossStream = !0);
				var r = t.getBits(n, t.COVERAGE_FORMAT, t.COVERAGE_FORMAT_SHIFT);
				0 == r ? this.readSubtable0Format0(e) : 2 == r && this.readSubtable0Format2(e)
			}
		},
		t.prototype.readSubtable0Format0 = function(t) {
			this.pairs = new o,
			this.pairs.read(t)
		},
		t.prototype.readSubtable0Format2 = function(t) {},
		t.prototype.readSubtable1 = function(t) {},
		t.isBitsSet = function(e, n, r) {
			return 0 != t.getBits(e, n, r)
		},
		t.getBits = function(t, e, n) {
			return (t & e) >> n
		},
		t
	} ();
	i.COVERAGE_HORIZONTAL = 1,
	i.COVERAGE_MINIMUMS = 2,
	i.COVERAGE_CROSS_STREAM = 4,
	i.COVERAGE_FORMAT = 65280,
	i.COVERAGE_HORIZONTAL_SHIFT = 0,
	i.COVERAGE_MINIMUMS_SHIFT = 1,
	i.COVERAGE_CROSS_STREAM_SHIFT = 2,
	i.COVERAGE_FORMAT_SHIFT = 8,
	e.KerningSubtable = i;
	var o = function() {
		function t() {}
		return t.prototype.read = function(t) {
			var e = t.readUnsignedShort();
			this.searchRange = t.readUnsignedShort() / 6;
			for (var n = (t.readUnsignedShort(), t.readUnsignedShort(), this.pairs = []), r = 0; r < e; r++) n[r] = [];
			for (var r = 0; r < e; ++r) {
				var i = t.readUnsignedShort(),
				o = t.readUnsignedShort(),
				s = t.readSignedShort();
				n[r][0] = i,
				n[r][1] = o,
				n[r][2] = s
			}
		},
		t.prototype.getKerning = function(t, e) {
			var n = [t, e, 0],
			i = r.Util.binarySearch(this.pairs, n);
			return i >= 0 ? this.pairs[i][2] : 0
		},
		t
	} ();
	e.PairData0Format0 = o
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e
	} (i.TTFTable);
	o.TAG = "DSIG",
	e.DigitalSignatureTable = o
},
function(t, e, n) {
	"use strict";
	var r = this && this.__extends ||
	function() {
		var t = Object.setPrototypeOf || {
			__proto__: []
		}
		instanceof Array &&
		function(t, e) {
			t.__proto__ = e
		} ||
		function(t, e) {
			for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
		};
		return function(e, n) {
			function r() {
				this.constructor = e
			}
			t(e, n),
			e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
		}
	} ();
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var i = n(0),
	o = function(t) {
		function e(e) {
			return t.call(this, e) || this
		}
		return r(e, t),
		e.prototype.getAchVendId = function() {
			return this.achVendId
		},
		e.prototype.setAchVendId = function(t) {
			this.achVendId = t
		},
		e.prototype.getAverageCharWidth = function() {
			return this.averageCharWidth
		},
		e.prototype.setAverageCharWidth = function(t) {
			this.averageCharWidth = t
		},
		e.prototype.getCodePageRange1 = function() {
			return this.codePageRange1
		},
		e.prototype.setCodePageRange1 = function(t) {
			this.codePageRange1 = t
		},
		e.prototype.getCodePageRange2 = function() {
			return this.codePageRange2
		},
		e.prototype.setCodePageRange2 = function(t) {
			this.codePageRange2 = t
		},
		e.prototype.getFamilyClass = function() {
			return this.familyClass
		},
		e.prototype.setFamilyClass = function(t) {
			this.familyClass = t
		},
		e.prototype.getFirstCharIndex = function() {
			return this.firstCharIndex
		},
		e.prototype.setFirstCharIndex = function(t) {
			this.firstCharIndex = t
		},
		e.prototype.getFsSelection = function() {
			return this.fsSelection
		},
		e.prototype.setFsSelection = function(t) {
			this.fsSelection = t
		},
		e.prototype.getFsType = function() {
			return this.fsType
		},
		e.prototype.setFsType = function(t) {
			this.fsType = t
		},
		e.prototype.getLastCharIndex = function() {
			return this.lastCharIndex
		},
		e.prototype.setLastCharIndex = function(t) {
			this.lastCharIndex = t
		},
		e.prototype.getPanose = function() {
			return this.panose
		},
		e.prototype.setPanose = function(t) {
			this.panose = t
		},
		e.prototype.getStrikeoutPosition = function() {
			return this.strikeoutPosition
		},
		e.prototype.setStrikeoutPosition = function(t) {
			this.strikeoutPosition = t
		},
		e.prototype.getStrikeoutSize = function() {
			return this.strikeoutSize
		},
		e.prototype.setStrikeoutSize = function(t) {
			this.strikeoutSize = t
		},
		e.prototype.getSubscriptXOffset = function() {
			return this.subscriptXOffset
		},
		e.prototype.setSubscriptXOffset = function(t) {
			this.subscriptXOffset = t
		},
		e.prototype.getSubscriptXSize = function() {
			return this.subscriptXSize
		},
		e.prototype.setSubscriptXSize = function(t) {
			this.subscriptXSize = t
		},
		e.prototype.getSubscriptYOffset = function() {
			return this.subscriptYOffset
		},
		e.prototype.setSubscriptYOffset = function(t) {
			this.subscriptYOffset = t
		},
		e.prototype.getSubscriptYSize = function() {
			return this.subscriptYSize
		},
		e.prototype.setSubscriptYSize = function(t) {
			this.subscriptYSize = t
		},
		e.prototype.getSuperscriptXOffset = function() {
			return this.superscriptXOffset
		},
		e.prototype.setSuperscriptXOffset = function(t) {
			this.superscriptXOffset = t
		},
		e.prototype.getSuperscriptXSize = function() {
			return this.superscriptXSize
		},
		e.prototype.setSuperscriptXSize = function(t) {
			this.superscriptXSize = t
		},
		e.prototype.getSuperscriptYOffset = function() {
			return this.superscriptYOffset
		},
		e.prototype.setSuperscriptYOffset = function(t) {
			this.superscriptYOffset = t
		},
		e.prototype.getSuperscriptYSize = function() {
			return this.superscriptYSize
		},
		e.prototype.setSuperscriptYSize = function(t) {
			this.superscriptYSize = t
		},
		e.prototype.getTypoLineGap = function() {
			return this.typoLineGap
		},
		e.prototype.setTypoLineGap = function(t) {
			this.typoLineGap = t
		},
		e.prototype.getTypoAscender = function() {
			return this.typoAscender
		},
		e.prototype.setTypoAscender = function(t) {
			this.typoAscender = t
		},
		e.prototype.getTypoDescender = function() {
			return this.typoDescender
		},
		e.prototype.setTypoDescender = function(t) {
			this.typoDescender = t
		},
		e.prototype.getUnicodeRange1 = function() {
			return this.unicodeRange1
		},
		e.prototype.setUnicodeRange1 = function(t) {
			this.unicodeRange1 = t
		},
		e.prototype.getUnicodeRange2 = function() {
			return this.unicodeRange2
		},
		e.prototype.setUnicodeRange2 = function(t) {
			this.unicodeRange2 = t
		},
		e.prototype.getUnicodeRange3 = function() {
			return this.unicodeRange3
		},
		e.prototype.setUnicodeRange3 = function(t) {
			this.unicodeRange3 = t
		},
		e.prototype.getUnicodeRange4 = function() {
			return this.unicodeRange4
		},
		e.prototype.setUnicodeRange4 = function(t) {
			this.unicodeRange4 = t
		},
		e.prototype.getVersion = function() {
			return this.version
		},
		e.prototype.setVersion = function(t) {
			this.version = t
		},
		e.prototype.getWeightClass = function() {
			return this.weightClass
		},
		e.prototype.setWeightClass = function(t) {
			this.weightClass = t
		},
		e.prototype.getWidthClass = function() {
			return this.widthClass
		},
		e.prototype.setWidthClass = function(t) {
			this.widthClass = t
		},
		e.prototype.getWinAscent = function() {
			return this.winAscent
		},
		e.prototype.setWinAscent = function(t) {
			this.winAscent = t
		},
		e.prototype.getWinDescent = function() {
			return this.winDescent
		},
		e.prototype.setWinDescent = function(t) {
			this.winDescent = t
		},
		e.prototype.getHeight = function() {
			return this.sxHeight
		},
		e.prototype.getCapHeight = function() {
			return this.sCapHeight
		},
		e.prototype.getDefaultChar = function() {
			return this.usDefaultChar
		},
		e.prototype.getBreakChar = function() {
			return this.usBreakChar
		},
		e.prototype.getMaxContext = function() {
			return this.usMaxContext
		},
		e.prototype.read = function(t, e) {
			this.version = e.readUnsignedShort(),
			this.averageCharWidth = e.readSignedShort(),
			this.weightClass = e.readUnsignedShort(),
			this.widthClass = e.readUnsignedShort(),
			this.fsType = e.readSignedShort(),
			this.subscriptXSize = e.readSignedShort(),
			this.subscriptYSize = e.readSignedShort(),
			this.subscriptXOffset = e.readSignedShort(),
			this.subscriptYOffset = e.readSignedShort(),
			this.superscriptXSize = e.readSignedShort(),
			this.superscriptYSize = e.readSignedShort(),
			this.superscriptXOffset = e.readSignedShort(),
			this.superscriptYOffset = e.readSignedShort(),
			this.strikeoutSize = e.readSignedShort(),
			this.strikeoutPosition = e.readSignedShort(),
			this.familyClass = e.readSignedShort(),
			this.panose = e.read1(10),
			this.unicodeRange1 = e.readUnsignedInt(),
			this.unicodeRange2 = e.readUnsignedInt(),
			this.unicodeRange3 = e.readUnsignedInt(),
			this.unicodeRange4 = e.readUnsignedInt(),
			this.achVendId = e.readString(4),
			this.fsSelection = e.readUnsignedShort(),
			this.firstCharIndex = e.readUnsignedShort(),
			this.lastCharIndex = e.readUnsignedShort(),
			this.typoAscender = e.readSignedShort(),
			this.typoDescender = e.readSignedShort(),
			this.typoLineGap = e.readSignedShort(),
			this.winAscent = e.readUnsignedShort(),
			this.winDescent = e.readUnsignedShort(),
			this.version >= 1 && (this.codePageRange1 = e.readUnsignedInt(), this.codePageRange2 = e.readUnsignedInt()),
			this.version >= 1.2 && (this.sxHeight = e.readSignedShort(), this.sCapHeight = e.readSignedShort(), this.usDefaultChar = e.readUnsignedShort(), this.usBreakChar = e.readUnsignedShort(), this.usMaxContext = e.readUnsignedShort()),
			this.initialized = !0
		},
		e
	} (i.TTFTable);
	o.WEIGHT_CLASS_THIN = 100,
	o.WEIGHT_CLASS_ULTRA_LIGHT = 200,
	o.WEIGHT_CLASS_LIGHT = 300,
	o.WEIGHT_CLASS_NORMAL = 400,
	o.WEIGHT_CLASS_MEDIUM = 500,
	o.WEIGHT_CLASS_SEMI_BOLD = 600,
	o.WEIGHT_CLASS_BOLD = 700,
	o.WEIGHT_CLASS_EXTRA_BOLD = 800,
	o.WEIGHT_CLASS_BLACK = 900,
	o.WIDTH_CLASS_ULTRA_CONDENSED = 1,
	o.WIDTH_CLASS_EXTRA_CONDENSED = 2,
	o.WIDTH_CLASS_CONDENSED = 3,
	o.WIDTH_CLASS_SEMI_CONDENSED = 4,
	o.WIDTH_CLASS_MEDIUM = 5,
	o.WIDTH_CLASS_SEMI_EXPANDED = 6,
	o.WIDTH_CLASS_EXPANDED = 7,
	o.WIDTH_CLASS_EXTRA_EXPANDED = 8,
	o.WIDTH_CLASS_ULTRA_EXPANDED = 9,
	o.FAMILY_CLASS_NO_CLASSIFICATION = 0,
	o.FAMILY_CLASS_OLDSTYLE_SERIFS = 1,
	o.FAMILY_CLASS_TRANSITIONAL_SERIFS = 2,
	o.FAMILY_CLASS_MODERN_SERIFS = 3,
	o.FAMILY_CLASS_CLAREDON_SERIFS = 4,
	o.FAMILY_CLASS_SLAB_SERIFS = 5,
	o.FAMILY_CLASS_FREEFORM_SERIFS = 7,
	o.FAMILY_CLASS_SANS_SERIF = 8,
	o.FAMILY_CLASS_ORNAMENTALS = 9,
	o.FAMILY_CLASS_SCRIPTS = 10,
	o.FAMILY_CLASS_SYMBOLIC = 12,
	o.FSTYPE_RESTRICTED = 1,
	o.FSTYPE_PREVIEW_AND_PRINT = 4,
	o.FSTYPE_EDITIBLE = 4,
	o.FSTYPE_NO_SUBSETTING = 256,
	o.FSTYPE_BITMAP_ONLY = 512,
	o.TAG = "OS/2",
	e.OS2WindowsMetricsTable = o
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = n(1),
	i = function() {
		function t(t) {
			this.data = null,
			this.currentPosition = 0,
			this.data = t,
			this.view = new DataView(t.buffer, 0)
		}
		return t.prototype.readString = function(t) {
			var e = this.read1(t);
			return r.Util.bytesToString(e)
		},
		t.prototype.read32Fixed = function() {
			var t = 0;
			return t = this.readSignedShort(),
			t += this.readUnsignedShort() / 65536
		},
		t.prototype.readSignedByte = function() {
			var t = this.read();
			return t < 127 ? t: t - 256
		},
		t.prototype.readUnsignedByte = function() {
			var t = this.read();
			if ( - 1 != t) return t
		},
		t.prototype.readUnsignedInt = function() {
			var t = this.view.getUint32(this.currentPosition);
			return this.currentPosition += 4,
			t
		},
		t.prototype.readUnsignedByteArray = function(t) {
			for (var e = [], n = 0; n < t; n++) e[n] = this.read();
			return e
		},
		t.prototype.readUnsignedShortArray = function(t) {
			for (var e = [], n = 0; n < t; n++) e[n] = this.readUnsignedShort();
			return e
		},
		t.prototype.read1 = function(t) {
			for (var e = new Uint8Array(t), n = 0, r = 0; r < t && -1 != (n = this.read3(e, r, t - r));) r += n;
			return r == t ? e: void 0
		},
		t.prototype.seek = function(t) {
			this.currentPosition = t
		},
		t.prototype.readSignedShort = function() {
			var t = this.view.getInt16(this.currentPosition, !1);
			return this.currentPosition += 2,
			t
		},
		t.prototype.readUnsignedShort = function() {
			var t = this.view.getUint16(this.currentPosition, !1);
			return this.currentPosition += 2,
			t
		},
		t.prototype.read3 = function(t, e, n) {
			if (this.currentPosition < this.data.length) {
				var i = Math.min(n, this.data.length - this.currentPosition);
				return r.Util.arrayCopy(this.data, this.currentPosition, t, e, i),
				this.currentPosition += i,
				i
			}
			return - 1
		},
		t.prototype.read = function() {
			var t = this.data[this.currentPosition];
			return this.currentPosition++,
			(t + 256) % 256
		},
		t.prototype.readLong = function() {
			return (this.readSignedInt() << 32) + (4294967295 & this.readSignedInt())
		},
		t.prototype.getCurrentPosition = function() {
			return this.currentPosition
		},
		t.prototype.getOriginalData = function() {
			return this.data
		},
		t.prototype.getOriginalDataSize = function() {
			return this.data.byteLength
		},
		t.prototype.readSignedInt = function() {
			var t = this.read(),
			e = this.read(),
			n = this.read(),
			r = this.read();
			if (! ((t | e | n | r) < 0)) return (t << 24) + (e << 16) + (n << 8) + (r << 0)
		},
		t
	} ();
	e.TTFDataStream = i
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = function() {
		function t() {}
		return t.getPathForCharacterCode = function(e, n) {
			var r = n,
			i = e.glyphTable.getGlyph(r);
			if (null != i) {
				var o = i.getPath();
				return e.scale && t.scalePath(e.scale, o.data),
				o
			}
			return null
		},
		t.scalePath = function(t, e) {
			for (var n = 0; n < e.length; n++) switch (e[n]) {
			case 0:
			case 1:
				e[n + 1] = e[n + 1] * t,
				e[n + 2] = e[n + 2] * t,
				n += 2;
				break;
			case 3:
				e[n + 1] = e[n + 1] * t,
				e[n + 2] = e[n + 2] * t,
				e[n + 3] = e[n + 3] * t,
				e[n + 4] = e[n + 4] * t,
				e[n + 5] = e[n + 5] * t,
				e[n + 6] = e[n + 6] * t,
				n += 6;
				break;
			case 4:
				e[n + 1] = e[n + 1] * t,
				e[n + 2] = e[n + 2] * t,
				e[n + 3] = e[n + 3] * t,
				e[n + 4] = e[n + 4] * t,
				n += 4;
				break;
			case 5:
				break;
			case 2:
				n += 2;
				break;
			case 6:
				n += 7
			}
		},
		t
	} ();
	e.TTFGlyph2D = r
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = function() {
		function t() {}
		return t
	} ();
	e.TagInfo = r;
	var i = function() {
		function t() {}
		return t.prototype.parse = function(t, e, n) {
			this.parser = e,
			this.renderer = n;
			var r = this,
			i = e.doc,
			o = i.docRootPath,
			s = o.lastIndexOf("/"); - 1 != s && (o = o.substring(0, s + 1));
			var a = o + t.textContent;
			e.zip.file(a).async("text").then(function(t) {
				r.parseCustomTags(o, (new DOMParser).parseFromString(t, "text/xml").documentElement)
			})
		},
		t.prototype.parseCustomTags = function(t, e) {
			for (var n = this,
			i = e.childNodes,
			o = i.length,
			s = this.tagList = [], a = 0; a < o; a++) {
				var h = i.item(a);
				if (1 == h.nodeType) switch (h.localName) {
				case "CustomTag":
					var p = new r;
					p.file = t + h.firstElementChild.textContent,
					s.push(p)
				}
			}
			for (var c = [], u = 0, l = s; u < l.length; u++) {
				var p = l[u];
				c.push(this.readTagFile(p))
			}
			Promise.all(c).then(function() {
				n.createTagView()
			})
		},
		t.prototype.readTagFile = function(t) {
			return this.parser.zip.file(t.file).async("text").then(function(e) {
				t.el = (new DOMParser).parseFromString(e, "text/xml").documentElement
			})
		},
		t.prototype.createTagView = function() {
			for (var t = this,
			e = document.createElement("ul"), n = 0, r = this.tagList; n < r.length; n++) {
				var i = r[n];
				this.createNode(i.el, e)
			}
			var o = document.getElementById("customTagContainer");
			o.innerHTML = "";
			var s = document.createElement("div");
			s.appendChild(e),
			o.appendChild(s),
			$(s).jstree(),
			$(s).on("changed.jstree",
			function(e, n) {
				var r = n.node.data,
				i = r.ref;
				if (i) {
					var o = r.parsedObjRef;
					if (!o) {
						o = r.parsedObjRef = {};
						for (var s = i.split(","), a = 0; a < s.length; a++) {
							var h = s[a].split(":"),
							p = parseInt(h[0]) - 1,
							c = parseInt(h[1]),
							u = o[p];
							u || (u = o[p] = []),
							u.push(c)
						}
						r.parsedObjRef = o
					}
					var l = t.parser.doc.pages;
					for (var d in o) {
						for (var f = Number(d), g = l[f], y = g.selectedObjects = {},
						m = o[f], v = 0, S = m; v < S.length; v++) {
							y[S[v]] = 1
						}
						t.renderer.repaintPage(f),
						t.renderer.skipTo(f)
					}
				}
			})
		},
		t.prototype.createNode = function(t, e) {
			for (var n = t.childNodes,
			r = n.length,
			i = 0; i < r; i++) {
				var o = n.item(i);
				if (1 == o.nodeType && "ObjectRef" !== o.localName) {
					var s = document.createElement("li");
					if (s.innerText = o.localName, e.appendChild(s), o.childElementCount) if (this.isAllChildObjectRef(o)) this.setObjectRef(o, s);
					else {
						var a = document.createElement("ul");
						s.appendChild(a),
						this.createNode(o, a)
					}
				}
			}
		},
		t.prototype.isAllChildObjectRef = function(t) {
			for (var e = t.childNodes,
			n = e.length,
			r = 0; r < n; r++) {
				var i = e.item(r);
				if (1 == i.nodeType && "ObjectRef" !== i.localName) return ! 1
			}
			return ! 0
		},
		t.prototype.setObjectRef = function(t, e) {
			for (var n = t.childNodes,
			r = n.length,
			i = 0; i < r; i++) {
				var o = n.item(i);
				if (1 == o.nodeType) {
					var s = o.getAttribute("PageRef"),
					a = o.textContent,
					h = s + ":" + a,
					p = e.getAttribute("data-ref");
					p ? p += ",": p = "",
					e.setAttribute("data-ref", p + h)
				}
			}
		},
		t
	} ();
	e.CustomTagsView = i
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = n(3),
	i = n(1),
	o = n(40),
	s = n(4),
	a = n(41),
	h = function() {
		function t() {}
		return t
	} (),
	p = function() {
		function t() {}
		return t.prototype.reset = function() {
			this.oldStroke = null,
			this.oldFill = null,
			this.black = !1
		},
		t
	} ();
	e.RenderState = p;
	var c = function() {
		function t() {
			this.needRestore = !1,
			this.vTop = 0,
			this.currentZoom = 1,
			this.cx = 0,
			this.cy = 0,
			this.pixelRatio = 2,
			this.isTransform = !1,
			this.enableTextLayer = !0,
			this.loadedImageIds = {},
			this.loadingImageIds = {},
			this.canvasPool = [],
			this.isAutoZoom = !0,
			this.rotation = 0,
			this.renderState = new p,
			this.tmpSize = new i.Size,
			this.toolbar = document.getElementById("ofdviewer-toolbar"),
			this.contentContainer = document.getElementById("contentContainer"),
			this.viewer = document.getElementById("ofdviewer"),
			this.printContainer = document.getElementById("printContainer"),
			this.pageNumInput = document.getElementById("pageNumb"),
			this.pageTotalNumLabel = document.getElementById("pageTotalNumb");
			var e = t.defaultFontInfo;
			e || (e = t.defaultFontInfo = Object.create(null), e.name = "SimSun")
		}
		return t.prototype.init = function(t, e) {
			this.doc = t,
			this.parser = e,
			this.setPageNum(0)
		},
		t.prototype.initModelSize = function() {
			if (!this.modelSizeInited) {
				this.modelSizeInited = !0;
				for (var t = this.doc,
				e = (this.parser, 0), n = 0, r = t.pages, i = r.length, o = 0; o < i; o++) {
					var s = r[o],
					a = s.physicalBox || t.physicalBox; (s.width = a[2]) > e && (e = s.width),
					this.pageMaxWidth = e,
					s.y = n,
					s.height = a[3],
					n += s.height + 14
				}
				document.body.oncontextmenu = function() {
					return ! 1
				}
			}
		},
		t.prototype.onWindowResize = function() {
			this.modelSizeInited && (this.isAutoZoom && (this.calcAutoZoom(), this.zoom(this.currentZoom, !1, !1)), this.onscroll())
		},
		t.prototype.calcAutoZoom = function() {
			var t = document.body.clientWidth,
			e = document.body.clientWidth - this.pageMaxWidth;
			e < 100 && (e = 100),
			this.currentZoom = (t - e) / this.pageMaxWidth,
			this.currentZoom < .5 && (this.currentZoom = .5)
		},
		t.prototype.repaint = function() {
			if (!this.created) {
				this.created = !0,
				this.finder || (this.finder = new a.Finder(this));
				var t = this;
				this.checkWatermarkQR(function() {
					t.onWatermarkQRGenerated()
				})
			}
		},
		t.prototype.onWatermarkQRGenerated = function() {
			this.genPageBox(),
			this.onWindowResize();
			var t = this;
			document.addEventListener("scroll",
			function() {
				t.onscroll()
			}),
			this.onscroll()
		},
		t.prototype.checkWatermarkQR = function(t) {
			var e = this.watermarkInfo;
			if (e) for (var n = e.length,
			r = this,
			i = 0; i < n; i++) !
			function(n) {
				var i = e[n];
				if (1 == i.type) {
					var o = r.qr;
					if (!o) {
						var s = document.createElement("div");
						s.style.position = "absolute",
						s.style.left = "0px",
						s.style.top = "0px",
						s.style.width = "16px",
						s.style.height = "16px",
						document.body.appendChild(s),
						o = r.qr = new QRCode(s, {
							text: i.text,
							width: i.size,
							height: i.size
						}),
						r.qrContainer = s
					}
					o.clear(),
					o.makeCode(i.text);
					var a = r.qrContainer.querySelector("img");
					a && (a.onload = function() {
						i.img = a,
						t()
					})
				}
			} (i);
			else t()
		},
		t.prototype.onscroll = function() {
			if (this.created) {
				this.onDocumentScroll();
				var t = this.startPageIndex;
				this.currentPageNum != t && this.setPageNum(t),
				this.showPage2()
			}
		},
		t.prototype.showPage2 = function() {
			var t = this.startPageIndex,
			e = this.endPageIndex;
			if (t != e) for (var n = t; n <= e; n++) this.showPage(n);
			else this.showPage(t)
		},
		t.prototype.showPage = function(t, e, n) {
			void 0 === e && (e = !1),
			void 0 === n && (n = null);
			var r = this.doc.pages[t];
			if (r.container.querySelector("canvas")) return void(n && n());
			if (this.loadPageImages(r)) {
				var i = this;
				r.waitImageLoadingTimer || (r.waitImageLoadingTimer = window.setInterval(function() {
					for (var t = r.images,
					o = !0,
					s = i.loadedImageIds,
					a = 0; a < t.length; a++) if (!s[t[a].resourceID]) {
						o = !1;
						break
					}
					o && (r.imagesLoaded = !0, window.clearInterval(r.waitImageLoadingTimer), r.waitImageLoadingTimer = 0, (i.isPageVisible(r) || e) && i.showPage(r.index, !0, n))
				},
				20))
			} else this.genPageContent2(r),
			n && n()
		},
		t.prototype.isPageVisible = function(t) {
			return ! (t.index < this.startPageIndex || t.index > this.endPageIndex)
		},
		t.prototype.loadPageImages = function(t) {
			if (t.imagesLoaded) return ! 1;
			for (var e = (this.doc.imageIds, this.loadedImageIds), n = t.images, r = {},
			i = 0; i < n.length; i++) {
				var o = n[i],
				s = o.resourceID;
				e[s] ? o.loaded = !0 : r[s] = o
			}
			var a = Object.keys(r);
			if (0 == a.length) return t.imagesLoaded = !0,
			!1;
			for (var h = this.loadingImageIds,
			p = 0,
			c = a; p < c.length; p++) {
				var s = c[p];
				h[s] || (h[s] = 1, this.doLoadPageImages(s, r[s], t, e))
			}
			return ! 0
		},
		t.prototype.doLoadPageImages = function(t, e, n, r) {
			var i = this;
			e.img.onload = function() {
				e.loaded = !0,
				r[e.resourceID] = 1
			},
			i.parser.getResFile(t,
			function(t) {
				e.img.src = URL.createObjectURL(t)
			})
		},
		t.prototype.genPageContent2 = function(t) {
			var e, n = this.canvasPool;
			if (n.length < 10) e = new h,
			e.canvas = this.createCanvas(t),
			e.page = t,
			n.push(e);
			else for (var r = n.length - 1; r > -1 && (e = n[r], this.isPageVisible(e.page)); r--);
			var i = e.canvas.getContext("2d"),
			o = e.page;
			if (o && (o.width != t.width || o.height != t.height)) {
				var s = e.canvas,
				a = this.pixelRatio;
				s.width = t.width * a,
				s.height = t.height * a,
				s.style.width = t.width + "px",
				s.style.height = t.height + "px",
				i.scale(a, a)
			}
			e.page = t,
			i.save(),
			this.paintPage(i, t),
			t.filledTextLayer = !0,
			i.restore(),
			t.container.appendChild(e.canvas)
		},
		t.prototype.repaintPage = function(t) {
			var e = this.doc.pages[t],
			n = e.container.querySelector("canvas");
			if (n) {
				var r = n.getContext("2d");
				r.save(),
				this.paintPage(r, e),
				r.restore()
			} else this.showPage(t)
		},
		t.prototype.onDocumentScroll = function() {
			for (var t = document.body.scrollTop,
			e = document.body.clientHeight,
			n = this.currentZoom,
			r = this.doc.pages,
			i = r.length,
			o = -1,
			s = -1,
			a = 0; a < i; a++) {
				var h = r[a];
				if ( - 1 == o && this.intersects(h, t, e, n) && (o = a), -1 != o && !this.intersects(h, t, e, n)) {
					s = a - 1;
					break
				}
			} - 1 == s && (s = i - 1),
			this.pageNumber = s,
			this.startPageIndex = o,
			this.endPageIndex = s
		},
		t.prototype.intersects = function(t, e, n, r) {
			var i = t.height * r;
			if (i <= 0 || n <= 0) return ! 1;
			var o = e,
			s = t.y * r;
			return i += s,
			n += o,
			(i < s || i > o) && (n < o || n > s)
		},
		t.prototype.genPageBox = function() {
			this.initModelSize();
			for (var t = this.contentContainer,
			e = this.doc.pages,
			n = e.length,
			r = 0; r < n; r++) {
				var i = e[r],
				o = this.genPageContainer(e[r]);
				this.enableTextLayer && !i.textLayer && (i.textLayer = this.initTextLayer(i, 0, 0, i.width, i.height, o), o.appendChild(i.textLayer)),
				t.appendChild(o),
				i.container = o
			}
		},
		t.prototype.genPageContainer = function(t) {
			var e = document.createElement("div");
			return e.style.margin = "0 auto",
			e.className = "pagediv",
			e.style.width = t.width + "px",
			e.style.height = t.height + "px",
			e.style.marginBottom = "14px",
			e.style.position = "relative",
			e
		},
		t.prototype.initPreDiv = function() {
			var t = document.createElement("div");
			t.style.position = "absolute",
			t.style.color = "transparent",
			this.preTextDiv = t
		},
		t.prototype.paintPage = function(t, e) {
			t.strokeStyle = "lightgray",
			t.fillStyle = "white",
			t.fillRect(0, 0, e.width, e.height);
			var n = e.layers;
			if (n) {
				var r = this.renderState;
				r.reset();
				for (var i = 0; i < n.length; i++) this.paintObjects(t, e, n[i].objects, r);
				var o = e.annotations;
				if (o) for (var s = 0,
				a = o; s < a.length; s++) {
					var h = a[s],
					p = h.boundary;
					p && t.translate(p[0], p[1]),
					this.paintObjects(t, e, h.Appearance.objects, r),
					p && t.translate( - p[0], -p[1])
				}
			}
			this.watermarkInfo && this.paintCustomWatermark(t, e, this.watermarkInfo)
		},
		t.prototype.paintCustomWatermark = function(t, e, n) {
			for (var r = 0; r < n.length; r++) {
				var o = n[r],
				s = o.font || ("center" == o.position ? "40px SimSun": "10px SimSun"),
				a = i.Util.getFont2(s),
				h = 10;
				h = a.height,
				t.font = s;
				var p = t.measureText(o.text).width,
				c = o.color || ("center" == o.position ? "gray": "black");
				if (t.fillStyle = c, o.type) {
					switch (o.position) {
					case "bottom-left":
						t.translate( - o.size, e.height - 2 * o.size),
						t.drawImage(o.img, o.size, o.size),
						t.translate(o.size, 2 * o.size - e.height);
						break;
					case "bottom-right":
						t.translate(e.width - 2 * o.size, e.height - 2 * o.size),
						t.drawImage(o.img, o.size, o.size),
						t.translate(2 * o.size - e.width, 2 * o.size - e.height);
						break;
					case "top-left":
						t.translate( - o.size, -o.size),
						t.drawImage(o.img, o.size, o.size),
						t.translate(o.size, o.size);
						break;
					case "top-right":
						t.translate(e.width - 2 * o.size, -o.size),
						t.drawImage(o.img, o.size, o.size),
						t.translate(2 * o.size - e.width, o.size);
						break;
					case "center":
						var u = (e.width - p) / 2,
						l = (e.height - h) / 2;
						t.translate(u + p / 2, l + h / 2),
						t.drawImage(o.img, o.size, o.size),
						t.translate( - (u + p / 2), -(l + h / 2));
						break;
					default:
						console.log("position not support", o.position)
					}
					this.qrContainer.innerHTML = ""
				} else switch (o.position) {
				case "bottom-left":
					t.fillText(o.text, 10, e.height - 10);
					break;
				case "bottom-right":
					t.fillText(o.text, e.width - 20, e.height - 10);
					break;
				case "top-left":
					t.fillText(o.text, 10, 10);
					break;
				case "top-right":
					t.fillText(o.text, e.width - 20, 10);
					break;
				case "center":
					var u = (e.width - p) / 2,
					l = (e.height - h) / 2,
					d = o.angle,
					f = !1;
					d && (f = !0, t.save(), t.globalAlpha = .6, t.translate(u + p / 2, l + h / 2), t.rotate( - d * Math.PI / 180), t.translate( - (u + p / 2), -(l + h / 2))),
					t.fillText(o.text, u, l),
					f && t.restore();
					break;
				default:
					console.log("position not support", o.position)
				}
			}
		},
		t.prototype.paintObjects = function(e, n, r, i) {
			for (var o = this.doc.publicRes || t.emptyObject,
			s = t.defaultFontInfo,
			a = r.length,
			h = 0; h < a; h++) {
				var p = r[h],
				c = p.boundary,
				u = c[0],
				l = c[1],
				d = c[2],
				f = c[3];
				switch (p.type) {
				case 2:
					var g = p,
					y = g.size,
					m = o[g.font] || s;
					if (g.stroke && (g.strokeColor && e.strokeStyle != g.strokeColor ? e.strokeStyle = i.oldStroke = g.strokeColor: "#000000" != e.strokeStyle && (e.strokeStyle = "#000000")), g.fill && (g.fillColor && e.fillStyle != g.fillColor ? e.fillStyle = i.oldFill = g.fillColor: "#000000" != e.fillStyle && (e.fillStyle = "#000000")), this.fillText(n, g, e, m, y), n.selectedObjects && n.selectedObjects[g.id]) {
						var v = g.boundary;
						e.globalAlpha = .5;
						var S = e.fillStyle;
						e.fillStyle = "#2874a6",
						e.fillRect(v[0], v[1], v[2], v[3]),
						e.globalAlpha = 1,
						e.fillStyle = S
					}
					break;
				case 3:
					var C = p;
					this.drawImage(e, C, C.resourceID, u, l, d, f, 0, 0, n.width, n.height);
					break;
				case 1:
					var b = p;
					if (b.movieID) {
						var _ = this.parser.getFilePath(b.movieID),
						T = document.createElement("embed");
						T.setAttribute("style", "position:absolute;top:0px;right:0px;width:100px;height:80px;background:lightgray"),
						T.src = _,
						document.body.appendChild(T)
					}
					var I = !1;
					if (b.abbreviatedData) {
						if (b.clips && b.clips.length > 0) {
							I = !0,
							e.save(),
							e.beginPath();
							for (var x = b.clips,
							O = 0; O < x.length; O++) this.createPath(e, x[O]);
							e.clip()
						}
						if (b.alpha && (I || (I = !0, e.save()), e.globalAlpha = b.alpha), e.translate(u, l), e.beginPath(), this.createPath(e, b.abbreviatedData), b.stroke) {
							b.strokeColor && (e.strokeStyle = i.oldStroke = b.strokeColor);
							var M = void 0;
							b.strokeColor && i.oldStroke != b.strokeColor && (M = e.strokeStyle, e.strokeStyle = i.oldStroke = b.strokeColor),
							b.lineWidth ? e.lineWidth = b.lineWidth: e.lineWidth = 1,
							e.stroke(),
							M && (e.strokeStyle = M)
						} else {
							b.fillColor && (e.fillStyle = i.oldFill = b.fillColor);
							var M = void 0;
							if (b.fillColor && i.oldFill != b.fillColor) {
								e.fillStyle;
								e.fillStyle = i.oldFill = b.fillColor
							}
							e.fill(),
							M && (e.fillStyle = M)
						}
						e.translate( - u, -l)
					}
					I && e.restore()
				}
			}
		},
		t.prototype.createPath = function(t, e, n, r) {
			void 0 === n && (n = 1),
			void 0 === r && (r = 1);
			for (var i = 0; i < e.length; i++) switch (e[i]) {
			case 0:
				t.moveTo(e[i + 1] * n, e[i + 2] * r),
				i += 2;
				break;
			case 1:
				t.lineTo(e[i + 1] * n, e[i + 2] * r),
				i += 2;
				break;
			case 3:
				t.bezierCurveTo(e[i + 1] * n, e[i + 2] * r, e[i + 3] * n, e[i + 4] * r, e[i + 5] * n, e[i + 6] * r),
				i += 6;
				break;
			case 4:
				t.quadraticCurveTo(e[i + 1] * n, e[i + 2] * r, e[i + 3] * n, e[i + 4] * r),
				i += 4;
				break;
			case 5:
				t.closePath();
				break;
			case 2:
				i += 2;
				break;
			case 6:
				if (!this.lastX && !this.lastY) {
					this.lastX = e[i + 7] * n * renderScaleDefault,
					this.lastY = e[i + 15] * n * renderScaleDefault
				}
				var o = e[i + 1] * n + " " + e[i + 2] * r + " " + e[i + 3] * n + " " + e[i + 4] * r + " " + e[i + 5] * n + " " + e[i + 6] * n + " " + e[i + 7] * n,
				s = this.convertPoint(o);
				this.drawSVGarcOnCanvas(t, this.lastX, this.lastY, renderScaleDefault * s[0], renderScaleDefault * s[1], s[2], s[3], s[4], renderScaleDefault * s[5], renderScaleDefault * s[6]),
				this.lastX = renderScaleDefault * s[5],
				this.lastY = renderScaleDefault * s[6],
				i += 7
			}
		},
		t.prototype.convertPoint = function(t) {
			for (var e = t.split(" "), n = [], r = 0; r < e.length; r++) n[r] = parseFloat(e[r]);
			return n
		},
		t.prototype.drawSVGarcOnCanvas = function(t, e, n, r, i, o, s, a, h, p) {
			var c = function(t) {
				return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2))
			},
			u = function(t, e) {
				return (t[0] * e[0] + t[1] * e[1]) / (c(t) * c(e))
			},
			l = function(t, e) {
				return (t[0] * e[1] < t[1] * e[0] ? -1 : 1) * Math.acos(u(t, e))
			},
			d = Math.cos(o) * (e - h) / 2 + Math.sin(o) * (n - p) / 2,
			f = -Math.sin(o) * (e - h) / 2 + Math.cos(o) * (n - p) / 2,
			g = Math.pow(d, 2) / Math.pow(r, 2) + Math.pow(f, 2) / Math.pow(i, 2);
			g > 1 && (r *= Math.sqrt(g), i *= Math.sqrt(g));
			var y = (s == a ? -1 : 1) * Math.sqrt((Math.pow(r, 2) * Math.pow(i, 2) - Math.pow(r, 2) * Math.pow(f, 2) - Math.pow(i, 2) * Math.pow(d, 2)) / (Math.pow(r, 2) * Math.pow(f, 2) + Math.pow(i, 2) * Math.pow(d, 2)));
			isNaN(y) && (y = 0);
			var m = y * r * f / i,
			v = y * -i * d / r,
			S = (e + h) / 2 + Math.cos(o) * m - Math.sin(o) * v,
			C = (n + p) / 2 + Math.sin(o) * m + Math.cos(o) * v,
			b = l([1, 0], [(d - m) / r, (f - v) / i]),
			_ = [(d - m) / r, (f - v) / i],
			T = [( - d - m) / r, ( - f - v) / i],
			I = l(_, T);
			u(_, T) <= -1 && (I = Math.PI),
			u(_, T) >= 1 && (I = 0);
			var x = r > i ? r: i,
			O = r > i ? 1 : r / i,
			M = r > i ? i / r: 1;
			t.translate(S, C),
			t.rotate(o),
			t.scale(O, M),
			t.arc(0, 0, x, b, b + I, 1 - a),
			t.scale(1 / O, 1 / M),
			t.rotate( - o),
			t.translate( - S, -C)
		},
		t.prototype.getDisplaySize = function(t, e, n, r) {
			if (0 === t) return r.reset(e, n);
			if (90 === t) return r.reset(n, e);
			if (180 === t) return r.reset(e, n);
			if (270 === t) return r.reset(n, e);
			var i = Math.cos(t * Math.PI / 180);
			r.reset(e / i, n / i)
		},
		t.prototype.drawImage = function(t, e, n, r, i, o, s, a, h, p, c) {
			var u = e.img;
			if (u) {
				t.save(),
				e.clips && e.clips.length > 0 && (t.beginPath(), this.createPath(t, e.clips[0]), t.clip());
				var l = e.CTM;
				if (l) {
					t.translate(r, i);
					var d = l[0],
					f = l[1],
					g = l[3],
					y = (360 + 180 * Math.atan2(f, d) / Math.PI) % 360,
					m = this.tmpSize;
					this.getDisplaySize(y, 0 === d ? o: d, 0 === g ? s: g, m),
					(m.width < 0 || m.height < 0) && (t.scale(m.width < 0 ? -1 : 1, m.height < 0 ? -1 : 1), m.height < 0 && t.translate(0, m.height));
					var v = Math.abs(m.width),
					S = Math.abs(m.height);
					t.translate(o / 2, s / 2),
					t.rotate(y * Math.PI / 180),
					t.drawImage(u, -v / 2, -S / 2, v, S)
				} else t.translate(r, i),
				t.drawImage(u, 0, 0, o, s);
				t.restore()
			}
		},
		t.prototype.fillTextGlyph = function(t, e, n, r, i) {
			var o = e.cg.glyphIds,
			a = s.FontEngine.getGlyphPath(r, o);
			if (!a) return ! 1;
			for (var h = !0,
			p = a.length,
			c = 0; c < p; c++) if (a[c] && 0 != a[c].length) {
				h = !1;
				break
			}
			if (!h) {
				n.save(),
				e.alpha && (n.globalAlpha = e.alpha);
				var u = e.clips;
				if (u && u.length > 0) {
					n.beginPath();
					for (var c = 0; c < u.length; c++) this.createPath(n, u[c]);
					n.clip()
				}
				var l = i / 1e3,
				d = l,
				f = e.CTM;
				f && (f[0] && (l *= f[0]), f[3] && (d *= f[3])),
				n.translate(e.boundary[0] + e.x, e.boundary[1] + e.y),
				n.scale(1, -1);
				var g = e.deltax;
				p = o.length,
				n.beginPath();
				for (var c = 0; c < p; c++) g && 0 != c && n.translate(g[c - 1], 0),
				a[c] && this.createPath(n, a[c], l, d);
				return e.fill && n.fill(),
				e.stroke && n.stroke(),
				n.restore(),
				!0
			}
		},
		t.prototype.fillText = function(t, e, n, i, o) {
			var s = !1;
			e.cg && i.file && (s = this.fillTextGlyph(t, e, n, i, o));
			var a = e.boundary,
			h = a[0],
			p = a[1],
			c = a[2],
			u = a[3],
			l = h + e.x,
			d = p + e.y,
			f = "";

			i.name = getFontFamilyMore(i.name);
			e.bold && (f += "Bold "),
			e.italic && (f += "Italic "),
			e.CTM && e.CTM[0] && (o *= e.CTM[0]);
			var g = f + o + "px " + i.name;
			n.font = g;
			for (var y = !1,
			m = 0,
			v = 0,
			S = 0; S < e.textCode.length; S++) {
				var C = new r.Rect;
				v != p && (m = 0),
				C.x = h + m,
				C.y = p,
				C.width = c - m,
				C.height = u,
				e.deltax && S < e.deltax.length && (C.width = e.deltax[S], m += e.deltax[S]),
				t.charxy.push(C),
				v = p
			}
			if (!s) {
				e.alpha && (y = !0, n.save(), n.globalAlpha = e.alpha);
				var b = e.clips;
				if (b && e.clips.length > 0) {
					y || (y = !0, n.save()),
					n.beginPath();
					for (var S = 0; S < b.length; S++){
						this.createPath(n, b[S]);
						// n.clip();
					}
				}
				if (e.CTM) {
					y || (y = !0, n.save());
					var _ = e.CTM,
					T = _[0],
					I = _[1],
					x = (_[3], (360 + 180 * Math.atan2(I, T) / Math.PI) % 360);
					n.translate(l, d),
					n.rotate( - x * Math.PI / 180),
					n.translate( - l, -d)
				}
				var O = e.stroke,
				M = e.fill,
				A = e.deltax;
				if (A) for (var P = e.textCode.length,
				N = l,
				E = void 0,
				S = 0; S < P; S++) 0 != S && (N += A[S - 1]),
				E = S != P - 1 ? A[S] : l + c - N,
				M && n.fillText(e.textCode[S], N, d, E),
				O; //n.strokeText(e.textCode[S], N, d, E);
				else M && n.fillText(e.textCode, l, d, c),
				O; //n.strokeText(e.textCode, l, d, c)
			}
			this.enableTextLayer && !t.filledTextLayer && this.fillTextLayer(t, e, h, p, l, d, n.font),
			y && n.restore()
		},
		t.prototype.fillTextLayer = function(t, e, n, r, i, o, s) {
			var a = (0 | n) + ":" + (0 | r);
			var o = o - e.size * 0.9 + e.size; //文字层高度调整
			if (!t.texts[a]) {
				var h = this.preTextDiv;
				if (this.cy == r && Math.round(n) == Math.round(this.cx + e.size)) h.style.position = "absolute",
				h.style.maxWidth = 3 * t.width / 4 + "px",
				h.style.whiteSpace = "nowrap",
				h.style.overflow = "hidden",
				h.style.top = o - e.size + "px",
				h.innerText += e.textCode,
				h.style.font = s,
				h.style.color = "transparent";
				else {
					var p = document.createElement("div");
					p.style.position = "absolute",
					p.style.maxWidth = 3 * t.width / 4 + "px",
					p.style.whiteSpace = "nowrap",
					p.style.overflow = "hidden",
					p.innerText = e.textCode,
					p.style.top = o - e.size + "px",
					p.style.left = i + "px",
					p.style.font = s,
					p.style.color = "transparent",
					t.textLayer.appendChild(p),
					t.texts[a] = p,
					this.preTextDiv = p
				}
			}
			this.cx = n,
			this.cy = r
		},
		t.prototype.createCanvas = function(t) {
			return i.Util.createCanvas(t.width, t.height, this.pixelRatio, null)
		},
		t.prototype.checkToolbar = function() {
			this.toolbar || (this.toolbar = document.querySelector("#ofdviewer-toolbar"), this.toolbarHeight = this.toolbar.clientHeight)
		},
		t.prototype.setWindowHeight = function(t) {
			this.clientHeight = t
		},
		t.prototype.setPageNum = function(t) {
			this.pageCount = this.doc.pages.length,
			this.pageNumInput.value = t + 1 + "",
			this.pageTotalNumLabel.innerText = " / " + this.pageCount,
			this.currentPageNum = t
		},
		t.prototype.initTextLayer = function(t, e, n, r, i, o) {
			var s = (this.contentContainer, document.createElement("div"));
			return s.setAttribute("class", "textlayer"),
			s.style.margin = "0 auto",
			s.style.position = "absolute",
			s.style.width = r + "px",
			s.style.height = i + "px",
			s
		},
		t.prototype.previous = function() {
			var t = parseInt(document.getElementById("pageNumb").value),
			e = this.doc.pages;
			if (t < 2) t = 2;
			else {
				var n = e[t - 2];
				if (! (t <= e.length && t > 0)) return;
				document.body.scrollTop = n.y,
				this.setPageNum(t - 1)
			}
		},
		t.prototype.next = function() {
			var t = parseInt(document.getElementById("pageNumb").value),
			e = this.doc.pages,
			n = e[t];
			t <= e.length - 1 && t > 0 && (document.body.scrollTop = n.y, this.setPageNum(t + 1))
		},
		t.prototype.skipTo = function(t) {
			var e;
			if (null == t) e = parseInt(document.getElementById("pageNumb").value);
			else {
				if (null == t || this.currentPageNum == t) return;
				e = t
			}
			var n = this.doc.pages;
			e > n.length ? e = n.length: e < 1 && (e = 1),
			document.body.scrollTop = e != t ? n[e - 1].y * this.currentZoom: n[e].y * this.currentZoom,
			this.setPageNum(e)
		},
		t.prototype.zoomOut = function() {
			var t = this.currentZoom; (t -= .1) >= .5 && t < 1.6 && this.zoom(t, !1, !0)
		},
		t.prototype.zoomIn = function() {
			var t = this.currentZoom; (t += .1) >= .5 && t < 1.6 && this.zoom(t, !1, !0)
		},
		t.prototype.zoom = function(t, e, n) {
			if (this.currentZoom = t, e && ( - 1 == t ? (this.isAutoZoom = !0, this.calcAutoZoom()) : this.isAutoZoom = !1), n) {
				var r = t.toFixed(1);
				$("#zoomValue").val("" + r)
			}
			t = this.currentZoom;
			var o = i.Util.getBrowserType(),
			s = this.contentContainer;
			this.toolbar;
			"firefox" == o ? (s.style["-moz-transform-origin"] = "center top", s.style["-moz-transform"] = "scale(" + t + ")") : "ie" == o ? (s.style.transform = "scale(" + t + ")", s.style.transformOrigin = "0.5 0", s.style["-ms-transform"] = "scale(" + t + ")", s.style["-ms-transform-origin"] = "0.5 0") : s.style.zoom = "" + t,
			this.onDocumentScroll(),
			this.showPage2()
		},
		t.prototype.print = function(t) {
			var e = this.printer;
			e || (e = this.printer = new o.Printer),
			e.print(t, this)
		},
		t.prototype.openFile = function() {
			var t = this,
			e = this.localFileInput;
			e || (e = this.localFileInput = document.querySelector("#localfile"), e.onchange = function() {
				var n = e.files[0];
				n && (t.reset(), t.onLocalFileSelected(n))
			}),
			e.click()
		},
		t.prototype.onLocalFileSelected = function(t) {
			var e = new FileReader,
			n = this;
			e.onload = function(t) {
				n.parser.openData(e.result, n)
			},
			e.readAsArrayBuffer(t);
			var r = document.getElementById("outlineContainer"),
			i = document.getElementById("customTagContainer"),
			o = document.getElementById("sideviewcontainer");
			r.innerHTML = "",
			i.innerHTML = "",
			o.style.display = "none"
		},
		t.prototype.reset = function() {
			s.FontEngine.reset(),
			this.canvas = null,
			this.created = !1,
			this.modelSizeInited = !1,
			this.allPageGenerated = !1,
			this.startPageIndex = this.endPageIndex = -1,
			this.rotation = 0,
			this.loadingImageIds = {},
			this.loadedImageIds = {},
			this.lazyGenPageTimer && clearTimeout(this.lazyGenPageTimer);
			var t = this.contentContainer;
			$(t).empty()
		},
		t.prototype.fullscreen = function() {
			var t = document.documentElement;
			t.requestFullscreen ? t.requestFullscreen() : t.webkitRequestFullscreen ? t.webkitRequestFullscreen() : t.mozRequestFullScreen ? t.mozRequestFullScreen() : t.msRequestFullscreen && t.msRequestFullscreen()
		},
		t.prototype.rotate = function() {
			var t = this.rotation += 90;
			360 == t && (t = 0);
			for (var e = this.contentContainer.childNodes,
			n = 0; n < e.length; n++) {
				var r = e[n];
				90 != this.rotation && 270 != this.rotation || (r.style.width = this.doc.pages[n].height + "", r.style.height = this.doc.pages[n].width + ""),
				r.style.transform = "rotate(" + this.rotation + "deg)"
			}
		},
		t
	} ();
	c.emptyObject = {},
	e.Renderer = c
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = n(1),
	i = function() {
		function t() {}
		return t.prototype.print = function(t, e) {
			this.render = e;
			var n = this;
			this.ensureAllImageLoaded(e,
			function() {
				n.cropMode = null != t,
				t ? n.beginCropPrint(t, e) : n.beginNormalPrint(e)
			})
		},
		t.prototype.initProcessDiv = function(t) {
			if (!this.processDiv) {
				var e = document.createElement("div");
				e.style.margin = "0 auto",
				e.style.width = "300px",
				e.style.height = "100px",
				e.style.border = "1px solid red",
				e.style.position = "fixed",
				e.style.left = (document.body.clientWidth - 300) / 2 + "px",
				e.style.top = (document.body.clientHeight - 100) / 2 + "px",
				e.style.backgroundColor = "gray",
				e.style.color = "white",
				e.style.textAlign = "center",
				e.style.lineHeight = "100px",
				e.style.display = "none",
				this.processDiv = e
			}
		},
		t.prototype.genPageContainer = function(t) {
			var e = document.createElement("div");
			return e.className = "page",
			e
		},
		t.prototype.genPageContent = function(t, e, n) {
			var i = this.canvas;
			i && this.prePageWidth == t.width && this.prePageHeight == t.height || (this.prePageWidth = t.width, this.prePageHeight = t.height, i = this.canvas = r.Util.createCanvas(t.width, t.height, e.pixelRatio, null), this.g = i.getContext("2d"));
			var o = this.g;
			o.save(),
			e.paintPage(o, t),
			o.restore();
			var s = this.genPageContainer(t),
			a = new Image;
			a.src = i.toDataURL("image/jpg"),
			a.className = "pagecontent",
			s.appendChild(a),
			this.printContainer.appendChild(s),
			this.processDiv.innerText = "准备打印 " + (t.index + 1) + "/" + e.pageCount;
			var h = e.doc.pages[t.index + 1];
			if (h) {
				var p = this;
				setTimeout(function() {
					p.genPageContent(h, e, t.index + 1)
				},
				100)
			} else this.callBrowserPrint()
		},
		t.prototype.callBrowserPrint = function() {
			this.processDiv.style.display = "none";
			var t = this;
			setTimeout(function() {
				window.print(),
				t.endPrint(t.render)
			},
			1)
		},
		t.prototype.beginNormalPrint = function(t) {
			this.initProcessDiv(t),
			this.printContainer = document.getElementById("printContainer"),
			this.processDiv.style.display = "block",
			document.body.appendChild(this.processDiv),
			t.viewer.style.display = "none",
			this.printContainer.style.display = "block",
			this.genPageContent(t.doc.pages[0], t, 0)
		},
		t.prototype.beginCropPrint = function(t, e) {
			e.viewer.style.display = "none";
			var n = e.pixelRatio,
			r = t.image,
			i = t.getCropBoxData();
			i.top *= n,
			i.left *= n,
			i.width *= n,
			i.height *= n;
			var o = document.createElement("div");
			o.style.width = i.width + "px",
			o.style.height = i.height + "px",
			o.style.zoom = 1 / n + "",
			o.style.margin = "0 auto",
			o.style.marginTop = Math.max(10, (document.body.clientHeight - o.clientHeight) / 2) + "px",
			o.style.overflow = "hidden";
			var s = new Image;
			s.src = r.src,
			s.style.marginTop = -i.top + "px",
			s.style.marginLeft = -i.left + "px",
			s.style.marginRight = -(r.width - (i.left + i.width)) + "px",
			s.style.marginBottom = -(r.height - (i.top + i.height)) + "px",
			o.appendChild(s),
			document.body.appendChild(o),
			this.cropDiv = o,
			window.print(),
			this.endPrint(e)
		},
		t.prototype.endPrint = function(t) {
			this.cropMode ? (t.viewer.style.display = "block", this.printContainer.style.display = "none", $(this.printContainer).empty(), document.body.removeChild(this.cropDiv), this.cropDiv = null) : (t.toolbar.style.display = "block", t.viewer.style.display = "block", this.printContainer.style.display = "none", $(this.printContainer).empty())
		},
		t.prototype.ensureAllImageLoaded = function(t, e) {
			var n = t.doc.imageIds,
			r = Object.keys(n);
			if (0 == r.length) e();
			else {
				for (var i = [], o = t.loadedImageIds, s = r.length, a = 0; a < s; a++) o[r[a]] || i.push(r[a]);
				0 == i.length && e();
				var h = this.doLoadImage;
				this.pendingImageCount = i.length;
				for (var a = 0; a < i.length; a++) {
					var p = i[a];
					h.call(this, t, p, n[p], e)
				}
			}
		},
		t.prototype.doLoadImage = function(t, e, n, r) {
			var i = this;
			n.onload = function() {--i.pendingImageCount || r()
			},
			t.parser.getResFile(e,
			function(t) {
				n.src = URL.createObjectURL(t)
			})
		},
		t.prototype.cancelProcess = function() {
			this.processDiv.style.display = "none"
		},
		t
	} ();
	e.Printer = i
},
function(t, e, n) {
	"use strict";
	Object.defineProperty(e, "__esModule", {
		value: !0
	});
	var r = n(1),
	i = function() {
		function t(t) {
			this.srolly = 0,
			this.searchIndex = 0,
			this.hasfound = !1,
			this.render = t;
			var e = this;
			e.windowfind = window.find;
			var n = this.searchInput = document.getElementById("search");
			document.onkeydown = function(t) {
				return 114 == t.keyCode ? (e.search(e.searchString), !1) : t.ctrlKey && 70 == t.keyCode ? (n.readOnly = !1, n.focus(), !1) : void 0
			},
			n.onclick = function() {
				n.readOnly = !1,
				n.focus()
			},
			n.onkeydown = function(t) {
				n.value && 13 == t.keyCode && (e.render.contentContainer.focus(), setTimeout(function() {
					n.readOnly || (n.readOnly = !0, e.searchIndex = 0),
					e.search(n.value)
				},
				1))
			}
		}
		return t.prototype.search = function(t) {
			this.searchString = t;
			for (var e = this,
			n = this.render,
			i = n.currentPageNum,
			o = n.doc.pages,
			s = i,
			a = o[s], h = o.length, p = -1; s < h;) {
				if ( - 1 != (p = a.allText.indexOf(t, this.searchIndex))) {
					this.searchIndex = p + t.length;
					break
				}
				this.searchIndex = 0,
				s++,
				a = o[s]
			} - 1 == p ? this.hasfound ? e.render.currentPageNum = 0 : alert('Not Find :"' + t + '"') : (this.hasfound = !0, this.render.showPage(s, !0,
			function() {
				e.render.skipTo(s),
				e.render.currentPageNum = s,
				//console.log(s),
				a = o[s];
				var n = e.maskCanvas;
				n || (n = e.maskCanvas = e.render.createCanvas(a), n.clientWidth == (0 | a.width) && n.clientHeight == (0 | a.height) || r.Util.resizeCanvas(n, e.render.pixelRatio, a.width), n.style.top = "0px", n.style.left = "0px", n.style.position = "absolute", n.style.pointerEvents = "none"),
				a.container.contains(n) || a.container.appendChild(n),
				e.showSearchHighlight(a, p, p + t.length)
			}))
		},
		t.prototype.showSearchHighlight = function(t, e, n) {
			var r = this.maskCanvas,
			i = r.getContext("2d");
			i.clearRect(0, 0, r.width, r.height),
			i.fillStyle = "#2980b9",
			i.globalAlpha = .2;
			for (var o, s = t.charxy,
			a = (s.length, document.body.scrollTop), h = document.body.clientHeight, p = e; p < n; p++) o = s[p],
			i.fillRect(o.x, o.y, o.width, o.height);
			var c = (a + h - (t.y + o.y)) * this.render.currentZoom;
			c < 0 && (document.body.scrollTop = (a - c + h / 2) * this.render.currentZoom),
			i.globalAlpha = 1
		},
		t
	} ();
	e.Finder = i
}]);