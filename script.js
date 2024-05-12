// Main Javascript file for Trig Worms, alias Vermichrome (must think of a better name!)
// ©John Lynch - January-March 2024
// Pushing to https://teraspora.github.io/trig_worms/ - this will always be the latest version
// Feb. 2024 - once ok at github.io, pushing to https://www.zeroundefined.net/vermichrome/

// First we define our curves. Just add a function to this object, and it will work,
// provided it returns a two-element array [x, y] in the range [-1 .. 1].
// Next, we define Scene class, and a child Scene2d class, then a CurveScene class which inherits from Scene2d.
// This class encapsulates the whole kaboodle.
// We instantiate this class and call its render() method, which then calls update(),
// which calls requestAnimationLoop(this.update.bind(this))).
// The CurveScene instance is the king.   It has curves, and each curve has a shape.
// Shapes inherit from a base class Shape, and include Polygon, Star, Ring etc..
// The user can vary a rake of parameters determining the curve, the shape, etc..
// The scene can have many curves, but a curve can have only one shape at a given time.
// The user can determine whether to fill/stroke the shapes, the radius, hue, stroke colour, rotation, waviness etc..
// Further documentation on Github.

// Some curves have their proper names.
// Others are ones I have invented or adapted, so I have just made up names for them.

const Curves = {

    oysteroid: {
        func: (a, b, c, d, e, f, g, t) => {
            const t_ = t / 10;
            const [ad, ae, af, ag] = [d, e, f, g].map(w => Math.abs(w));
            return [
                (Math.cos(a * t_) + Math.cos(b * t_) / d + Math.sin(c * t_)/ e)
                    * ad * ae / (ad * ae + ad + ae),
                (Math.sin(a * t_) + Math.sin(b * t_) / f + Math.cos(c * t_)/ g)
                    * af * ag / (af * ag + af + ag)
            ];
        },
        params: [3, -5, 17, 5, -3.5, 3.4, .9],   // more beautiful loops!!
        speed: 0.2
        // params: [27, 291, 77, 5, 400, 512, 2239],
        // speed: 0.02,
        // params: [11, 3, 17, 5, 28, 64, 9], // ball of string
        // speed: 0.1,
        // params: [3, -3, 17, 5, 28, 64, 9],  // twisted oval frame
        // speed: 0.4,
        // params: [-5, 7, 2, -1, 2, -5, 1],    // wide bowtie
        // speed: 0.4,
        // params: [-2.5, 2.5, 8, -2, -28, -64, -9],   // hoop of wire
        // speed: 0.4,
        // params: [-2.5, 2.5, 19, -4, -28, -64, -9],   // mirror frame, woven
        // speed: 0.4,
        // params: [3, -3, 17, 5, 5, 64, 9],   // oval frame
        // speed: 0.4,
        // params: [3, -3, 17, 5, -3.5, 3.4, .9],   // beautiful loops!!
        // speed: 0.2,
        // params: [3, -5, 19, 5, -4.5, 2.4, .707],   // yet more beautiful loops!!
        // speed: 0.2,
        // params: [-2, 1.5, 5, 1.367, 2.5, -2.4, 1.707],   // beautiful loopy assymetry
        // speed: 0.4,
        // params: [-2.11, 1.4142, 3, 2.367, 2.5, -2.4, 1.707],   // complex ball of string
        // speed: 0.4
    },

    chitonoid: {   // copy of oysteroid with different params
        func: (a, b, c, d, e, f, g, t) => {
            const t_ = t / 10;
            const [ad, ae, af, ag] = [d, e, f, g].map(w => Math.abs(w));
            return [
                (Math.cos(a * t_) + Math.cos(b * t_) / d + Math.sin(c * t_)/ e)
                    * ad * ae / (ad * ae + ad + ae),
                (Math.sin(a * t_) + Math.sin(b * t_) / f + Math.cos(c * t_)/ g)
                    * af * ag / (af * ag + af + ag)
            ];
        },
        params: [4, 2, 19, -4, -28, -64, -9],   // mirror frame, woven
        speed: 0.4,
        // params: [3, -5, 17, 5, -3.5, 3.4, .9],   // more beautiful loops!!
        // speed: 0.2
        // params: [27, 291, 77, 5, 400, 512, 2239],
        // speed: 0.02,
        // params: [11, 3, 17, 5, 28, 64, 9], // ball of string
        // speed: 0.1,
        // params: [3, -3, 17, 5, 28, 64, 9],  // twisted oval frame
        // speed: 0.4,
        // params: [-5, 7, 2, -1, 2, -5, 1],    // wide bowtie
        // speed: 0.4,
        // params: [-2.5, 2.5, 8, -2, -28, -64, -9],   // hoop of wire
        // speed: 0.4,
        // params: [3, -3, 17, 5, 5, 64, 9],   // oval frame
        // speed: 0.4,
        // params: [3, -3, 17, 5, -3.5, 3.4, .9],   // beautiful loops!!
        // speed: 0.2,
        // params: [3, -5, 19, 5, -4.5, 2.4, .707],   // yet more beautiful loops!!
        // speed: 0.2,
        // params: [-2, 1.5, 5, 1.367, 2.5, -2.4, 1.707],   // beautiful loopy assymetry
        // speed: 0.4,
        // params: [-2.11, 1.4142, 3, 2.367, 2.5, -2.4, 1.707],   // complex ball of string
        // speed: 0.4
    },

    zappoid: {
        func: (a, b, t) => [
                (Math.sin(a * Math.cos(t)) + Math.cos(b * Math.sin(t))) / 2,
                (Math.cos(a * Math.sin(t)) - Math.sin(b * Math.cos(t))) / 2,
            ],
        params: [33, 11],   // electron rings
        speed: 0.005
    },

    cardioid: {
        func: (a, t) => [
                a * (2 * Math.cos(t) - Math.cos(2 * t)),
                a * (2 * Math.sin(t) - Math.sin(2 * t))
            ],
        params: [0.33],   // electron rings
        speed: 0.2
    },

    satelloid: {
        func: (a, k, t) => [
                (Math.cos(a) * Math.cos(t) * Math.cos(k * t) - Math.sin(t) * Math.sin(k * t)) * 0.5,
                (Math.cos(a) * Math.sin(t) * Math.cos(k * t) + Math.cos(t) * Math.sin(k * t)) * 0.5
            ],
        params: [27, 11],
        speed: 0.05
    },

    quatrefoil: {
        func: (a, t) => [
                a * Math.sin(t) * Math.sin(t) * Math.cos(t),
                a * Math.cos(t) * Math.cos(t) * Math.sin(t)
            ],
        params: [2],
        speed: 0.05
    },

    maltese_x: {
        func: (a, t) => [
                a * Math.cos(t) * (Math.cos(t) * Math.cos(t) - 2),
                a * Math.sin(t) * Math.cos(t) * Math.cos(t)
            ],
        params: [0.8],
        speed: 0.05
    },

    epitrochoid: {
        func: (a, b, c, t) => [
                ((a + b) * Math.cos(t) - c * Math.cos(((a - b) / b) * t))
                    / (Math.abs(a) + Math.abs(b) + Math.abs(c)),
                ((a + b) * Math.sin(t) - c * Math.sin(((a - b) / b) * t))
                    / (Math.abs(a) + Math.abs(b) + Math.abs(c)),
            ],
        params: [5, 3, 5],
        speed: 0.2
    },
    
    rabbit_ears: {
        func: (t) => [
                Math.sin(t) * Math.log(Math.sin(t) * Math.sin(t)),
                Math.cos(4 * t)
            ],
        params: [],
        speed: 0.05
    },

    quasi_epitrochoid: {
        func: (a, b, c, t) => [
                ((a + b) * Math.cos(t) - c * Math.cos((a / b + 1) * t))
                    / (Math.abs(a) + Math.abs(b) + Math.abs(c)),
                ((a + b) * Math.sin(t) - c * Math.sin((a / b + 1) * t))
                    / (Math.abs(a) + Math.abs(b) + Math.abs(c)),
            ],
        params: [5, 3, 5],
        speed: 0.2
    },

    epicycloid: {
        func: (a, q, t) => [
                a / q * ((q + 1) * Math.cos(t) - Math.cos((q + 1) * t)),
                a / q * ((q + 1) * Math.sin(t) - Math.sin((q + 1) * t)),
            ],
        params: [0.7, 11.5],
        speed: 0.2
    },
    
    merlinium: {
        func: (a, b, c, d, t) => [
                Math.cos(a * Math.cos(b + Math.cos(t))),
                Math.sin(c * Math.sin(d + Math.sin(t))),
            ],
        params: [56, 12, 76, 102],  // good use of whole space
        speed: 0.002
    },

    loopoid: {
        func: (a, b, t) => [
            (Math.sin(a * t) * Math.cos(b * t)),
            (Math.cos(a * t) / (y = Math.sin(b * t)) ? y : 0.00000000000000000001),
        ],
        params: [5, 3],
        speed: 0.05
    },

    egg_mesh: {
        func: (a, b, t) => [
            (Math.cos(a + t) * Math.cos(b * t)),
            (Math.sin(a + t) / (y = Math.sin(b * t)) ? y : 0.00000000000000000001),
        ],
        params: [17, 4],
        speed: 0.05
    },

    polyfolium: {
        func: (a, b, t) => [
            (Math.sin(a * t) + Math.sin(b * t)) / 2,
            (Math.cos(a * t) - Math.cos(b * t)) / 2,
        ],
        params: [11, 8],
        speed: 0.02
    },

    orbital: {
        func: (a, k, t) => [
            (Math.sin(a) * Math.cos(t) * Math.sin(k * t) - Math.cos(t) * Math.cos(k * t)) * 0.5,
            (Math.sin(a) * Math.sin(t) * Math.sin(k * t) + Math.sin(t) * Math.cos(k * t)) * 0.5
        ],
        params: [27, 11],
        speed: 0.05
    },

    polygasteroid: {
        func: (a, p, q, t) => [
            Math.cos(q * t) * (a + Math.sin(p * t)) / (a + 1),
            Math.sin(q * t) * (a + Math.sin(p * t)) / (a + 1),
        ],
        // params: [5, 7, 3],
        params: [1, 8, 11],
        speed: 0.02
    },

    lissajous: {
        func: (kx, ky, t) => [
            Math.cos(kx * t),
            Math.sin(ky * t)
        ],
        params: [-3.1, 4.6],
        speed: 0.02
    },

    nodiform: {
        func: (a, b, t) => [
            (Math.cos(a * t) - Math.sin(t)) / 2,
            (Math.sin(b * t) + Math.cos(t)) / 2
        ],
        params: [5, 7],
        speed: 0.08
    },

    tangloid: {
        func: (a, b, t) => [
            (Math.cos(a * Math.sin(t)) - Math.sin(t)) / 2,
            (Math.sin(b * Math.cos(t)) + Math.cos(t)) / 2
        ],
        params: [17, 12],
        speed: 0.03
    },

    rhodonea: {
        func: (k, t) => [
            Math.cos(k * t + t) * Math.cos(t),
            Math.cos(k * t + t) * Math.sin(t),
        ],
        params: [1.16666666667],
        speed: 0.05
    },

    rose: {
        func: (n, t) => [
            Math.cos(n * t) * Math.cos(t),
            Math.cos(n * t) * Math.sin(t),
        ],
        params: [1.166666666667],
        speed: 0.2
    },

    hypotrochoid: {
        func: (R, r, d, t) => [
            ((R - r) * Math.cos(t) + d * Math.cos((R - r) / r * t)) / (R - r + d),
            ((R - r) * Math.sin(t) - d * Math.sin((R - r) / r * t)) / (R - r + d)
        ],
        params: [13, 11, 1],
        speed: 0.1
    },

    hypocycloid: {
        func: (a, b, t) => {
            const r = a - b;
            const p = r / b;
            return [
                (r * Math.cos(t) + b * Math.cos(p * t)) / a,
                (r * Math.sin(t) - b * Math.sin(p * t)) / a
            ];
        },
        params: [21, 4],
        speed: 0.3
    },

    anonoid: {
        func: (a, b, t) => [
            (a * Math.cos(-t) + Math.cos(b * t)) / (a + 1),
            (a * Math.sin(-t) + Math.sin(b * t)) / (a + 1)
        ],
        params: [13, 41],
        speed: 0.05
    },

    heart: {
        func: (a, b, t) => [
            a * Math.cos(t),
            -b * (Math.sin(t) + Math.sqrt(Math.abs(Math.cos(t))))
        ],
        params: [0.5, 0.6],
        speed: 0.2
    },

    dragonfly: {
        func: (a, b, c, d, t) => [
            (a * Math.cos(-t) + Math.cos(b * t)) / (a + 1),
            (c * Math.sin(-t) + Math.sin(d * t)) / (c + 1)
        ],
        // params: [13, 15, 17, 19],
        // params: [1, 4, 2, 7],
        // params: [2 * Math.PI, 7 * Math.PI, 13 * Math.PI, 37 * Math.PI],
        // params: [17 * Math.PI, 12 * Math.PI, 8 * Math.PI, 2 * Math.PI],
        // params: [12, 18, 6, 24],
        // params: [5, 9, 16, 29],
        // params: [3, 6, 9, 12],
        // params: [Math.PI, 3 * Math.PI, Math.PI, 7 * Math.PI],   // nice and twirly!
        params: [2, 3 * Math.PI, 4, 5 * Math.PI],   // nice and twirly!
        speed: 0.01
    },

    convolvulus: {
        func: (a, b, t) => [
            (Math.sin(a * Math.cos(t)) + Math.cos(b * Math.sin(t))) / 2,
            (Math.cos(a * Math.sin(t)) - Math.sin(b * Math.cos(t))) / 2,
        ],
        // params: [137, 19],   // Great string jumble!
        // speed: 0.001,
        // params: [51, 31],    // Twisty bananas
        // speed: 0.005,
        params: [18, 7],  // unpredictable, all over
        speed: 0.02
    },

    crisscross: {
        func: (p, q, t) => [            
            Math.sin(p * Math.PI * t / 10),
            Math.cos(q * Math.PI * t / 10)
        ],
        params: [13, 19],
        speed: 0.01
    },
    
    sinovial: {
        func: (a, b, t) => [
            (Math.sin(a * t) + Math.sin(b * t)) / 2,
            (Math.sin(a * t) - Math.sin(b * t)) / 2,
        ],
        params: [13, 3],
        speed: 0.02
    },

    cosy: {
        func: (a, b, t) => [
            (Math.cos(a * t) + Math.cos(b * t)) / 2,
            (Math.cos(a * t) - Math.cos(b * t)) / 2,
        ],
        params: [19, 7],
        speed: 0.02
    },

    ubiquitoid: {
        func: (a, b, t) => [
            (Math.sin(a * Math.cos(b * t))),
            (Math.cos(b * Math.sin(a * t))),
        ],
        params: [27, 23],   // 
        speed: 0.0002
    },

    zigzag: {
        func: (R, r, t) => {
            const s = R - r;
            return [
                (s * Math.cos(t) + r * Math.cos(s / r * t)) / R + 0.05 * Math.sin(t * 10),
                (s * Math.sin(t) - r * Math.sin(s / r * t)) / R - 0.04 * Math.cos(t * 11)
            ];
        },
        params: [63, 36],
        speed: 0.1
    },

    floroid: {
        func: (R, r, t) => {
            const s = R - r;
            return [
                (s * Math.cos(t) + r * Math.cos(s / r * t)) / R / 4,
                (s * Math.sin(t) - r * Math.sin(s / r * t)) / R / 4
            ];
        },
        params: [7, -6],
        speed: 0.1
    },

    squiggle: {
        func: (a, b, t) => [
            (Math.sin(a * t) + Math.cos(b * t)) / 2,
            (Math.cos(a * t) - Math.sin(b * t)) / 2,
        ],
        params: [13, 17],
        speed: 0.008
    },

    dust: {
        func: (a, b, c, d, t) => [
            Math.sin(a * t + b * Math.cos(c * t * Math.sin(d * t))),
            Math.cos(a * t + b * Math.sin(c * t * Math.cos(d * t))),
        ],
        params: [0, 17, -9, 42],
        speed: 0.008
    },

    astroid: {
        func: (p, t) => [
            Math.cos(t) ** p , 
            Math.sin(t) ** p
        ],
        params: [5],
        speed: 0.1
    },

    ellipse: {
        func: (a, b, t) => [
            a * Math.cos(t) / Math.max(a, b),
            b * Math.sin(t) / Math.max(a, b)
        ],
        params: [5, 3],
        speed: 0.05
    },

    init: function() {
        Object.keys(this).forEach(key => this[key].name = key);
        delete this.init;
        return this;
    }

}.init();

class Scene {
    static instance_count = 0;
    constructor(canvas) {
        this.id = Scene.instance_count++;
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.progress = 0;
        this.progress_delta = 0.04;
        this.paused = false;
        this.plain_colour = 'hsl(36 100% 90%)';
        this.debug_colour = 'hsl(42 100% 50%)';
    }
    render() {
    }
    update() {
        this.progress += this.progress_delta;
    }
}

class Scene2d extends Scene {
    static instance_count = 0;
    constructor(canvas) {
        super(canvas);
        this.ctx = this.canvas.getContext("2d");
    }
    render() {
        super.render();
    }
    update() {
        super.update();
    }
}

class CurveScene extends Scene2d {
    constructor(canvas, curves) {
        super(canvas);
        
        // Global effects
        this.ctx.shadowOffsetX = 4;
        this.ctx.shadowOffsetY = 4;
        this.ctx.shadowBlur = 4;    // quantity of blur applied; dimensionless; must be non-negative
        this.ctx.shadowColor = '#000';
        this.ctx.globalAlpha = 1.0;
        this.global_scale = 1;
        this.mirrored = true;
        this.shapes = ['Star', 'Polygon', 'Ring', 'Moon', 'Windmill'];

        this.property_map = {  // maps ids of input elements to canvas context properties
            'shadow-colour': val => {
                if (!val) return this.ctx.shadowColor;
                    this.ctx.shadowColor = val;
                },
            'global-alpha' : val => {
                if (!val) return this.ctx.globalAlpha;
                    this.ctx.globalAlpha = val;
                },
            'shadow-offset-x' : val => {
                if (!val) return this.ctx.shadowOffsetX;
                    this.ctx.shadowOffsetX = val;
                },
            'shadow-offset-y' : val => {
                if (!val) return this.ctx.shadowOffsetY;
                    this.ctx.shadowOffsetY = val;
                },
            'shadow-blur' : val => {
                if (!val) return this.ctx.shadowBlur;
                    this.ctx.shadowBlur = val;
                },
            'global-speed' : val => {
                if (!val) return this.progress_delta * 500;
                    this.progress_delta = val * 0.002;
                },
            'global-scale' : val => {
                if (!val) return this.global_scale;
                    this.global_scale = val;
                }
        }

        // CanvasRenderingContext2D: globalCompositeOperation property
        // see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
        const gco_values = {
            0: 'source-over',
            1: 'source-in',
            2: 'source-out',
            3: 'source-atop',
            4: 'destination-over',
            5: 'destination-in',
            6: 'destination-out',
            7: 'destination-atop',
            8: 'lighter',
            9: 'copy',
            10:'xor',
            11:'multiply',
            12:'screen',
            13:'overlay',
            14:'darken',
            15:'lighten',
            16:'color-dodge',
            17:'color-burn',
            18:'hard-light',
            19:'soft-light',
            20:'difference',
            21:'exclusion',
            22:'hue',
            23:'saturation',
            24:'color',
            25:'luminosity'
        };
        const gco_type = 0;
        this.ctx.globalCompositeOperation = gco_values[gco_type];
                
        // Curves
        this.curves = curves;
        this.curve_names = Object.keys(this.curves);
        // Choose 3 curves randomly
        this.active_curves = [];
        const curve_count = this.curve_names.length;
        while (this.active_curves.length < 3) {
            const n = rand_int(curve_count);
            const curve = this.curves[this.curve_names[n]];
            if (!this.active_curves.includes(curve)) {
                this.active_curves.push(curve);
            }
        }

        for (const c in this.curves) {
            const curve = this.curves[c];
            curve.default_colour = this.#get_random_colour();
            this.default_stroke_colour = '#111111';
            curve.colour = curve.default_colour;
            curve.polychrome_speed = 25;       // we'll have a range [0, .., 100] and set the normal to 25, so user can speed up 4x and slow down 25x
            curve.shape = this.#get_random_shape();
            curve.shape.polychrome_speed = curve.polychrome_speed;
            curve.shape.polychrome_stroke = false;
            this.rotations = [...document.querySelector('select.param#rotation').options].map(option => Number(option.value));
            curve.rotation = this.rotations[rand_int(this.rotations.length)];
            curve.seed = Math.random() * 4095;
            curve.hidden = !this.active_curves.includes(curve);
            curve.param_names = curve.func.toString().split(',').slice(0, curve.params.length).map(t => t.slice(-1));
            curve.aux = curve;
            curve.scale = 1;

            if (debug) {
                if (curve.name !=  debug) {
                    curve.hidden = true;
                }
                else {
                    this.current_curve = curve;
                    this.current_curve.hidden = false;
                    this.current_curve.shape.radius = 20;
                    if (this.current_curve.shape instanceof HubbedShape) {
                        this.current_curve.shape.hub = 4;
                    }
                    this.current_curve.colour = this.debug_colour;
                    this.current_curve.rotation = 1;
                }
            }
        }

        // Set current curve to be the first in the list of active curves
        this.current_curve = this.active_curves[0];
        this.current_curve.colour = null;           // Start with current curve multicoloured
        // ...and the other two curves with no fill, just polychrome_stroke
        [1, 2].forEach(i => {
            this.active_curves[i].shape.polychrome_stroke = true;
            this.active_curves[i].fill = false;
        });
        // UI Controls
        this.controls = document.querySelector('section#controls');
        this.curve_select = document.getElementById('curve-select');
        this.tbody = document.querySelector('table#param-table>tbody');
        this.row_template = this.tbody.firstElementChild.cloneNode(true);
        this.param_details = document.querySelector('#params-wrapper #details');
        this.function_ui_needs_updating = true;
        this.#create_curve_checkboxes();
        this.#create_params_section();
        this.#create_advanced_section();

        // Show/Hide Active Curve settings
        const active_curve_toggler = document.getElementById('active-curve-toggler');
        const curve_settings = document.getElementById('active-curve-settings');
        active_curve_toggler.addEventListener('click', _ => {
            const hidden = curve_settings.classList.toggle('hidden');
            active_curve_toggler.textContent = hidden ? '►' : (curve_settings.scrollIntoView({behavior: "smooth", block: "start"}), '▼');
        });

        // Show/Hide Advanced settings
        const advanced_toggler = document.getElementById('advanced-toggler');
        const advanced_settings = document.getElementById('advanced-settings');
        advanced_toggler.addEventListener('click', _ => {
            const hidden = advanced_settings.classList.toggle('hidden');
            advanced_toggler.textContent = hidden ? '►' : (advanced_settings.scrollIntoView({behavior: "smooth", block: "start"}), '▼');
        });

         // Show/Hide Function settings
         const function_toggler = document.getElementById('function-toggler');
         const function_settings = document.getElementById('function-settings');
         function_toggler.addEventListener('click', _ => {
             const hidden = function_settings.classList.toggle('hidden');
             function_toggler.textContent = hidden ? '►' : (function_settings.scrollIntoView({behavior: "smooth", block: "start"}), '▼');
         });
 
         // Buttons
        this.buttons = [...document.querySelectorAll('#buttons>button')];
        this.buttons.forEach(button => {
            button.addEventListener('click', event => {
                switch(event.target.id) {
                    case 'pause':
                        // Toggle play/pause
                        this.paused = !this.paused;
                        if (!this.paused) {
                            event.target.textContent = 'Pause';
                            this.frame_request = requestAnimationFrame(this.update.bind(this));
                        }
                        else {
                            cancelAnimationFrame(this.frame_request);
                            event.target.textContent = 'Play';
                        }
                        break;
                    case 'clear':
                        // Clear drawing
                        this.#clear_canvas();
                        break;
                    case 'background':
                        const cp = document.querySelector('section#colour-picker');
                        cp.style.left = `${event.target.getBoundingClientRect().left}px`;
                        cp.style.top = `${event.target.getBoundingClientRect().top}px`;
                        const cpi = cp.querySelector('input');
                        cpi.addEventListener('input', event => {
                            this.canvas.style.backgroundColor = event.target.value;
                        });
                        cpi.addEventListener('change', event => {
                            cp.hidden = true;
                            // need to remove previous background, which of course is opaque.
                            this.#clear_canvas();
                        });                        
                        cp.hidden = false;
                        const cpb = cp.querySelector('button#cp-hide');
                        cpb.addEventListener('click', _ => cp.hidden = true);
                        break;
                    case 'mirror':
                        this.mirrored = !this.mirrored;
                        event.target.textContent = this.mirrored ? 'Unmirror' : 'Mirror';
                        break;
                    case 'github':
                        break;
                    case 'ZU':
                        break;
                    case 'IO':
                        break;
                    case 'debug':
                        // Set all curves hidden except current curve
                        this.curve_names.forEach(curve => {
                            if (curve != this.current_curve.name) {
                                this.curves[curve].hidden = true;
                            }
                            else {
                                this.curves[curve].hidden = false;
                                this.curves[curve].colour = this.debug_colour;
                                this.curves[curve].shape.radius = 24;
                            }
                        });
                        this.active_curves =  [this.current_curve];
                        this.mirrored = false;
                        this.#initialise_buttons();
                        this.#update_parameter_display();
                        this.#update_curves_listing();
                        // Clear drawing
                        this.ctx.clearRect(0, 0, this.width, this.height);
                        this.progress = 0
                        if (this.paused) {
                            this.paused = false;
                            this.frame_request = requestAnimationFrame(this.update.bind(this));
                        }
                        break;
                    case 'save':
                        const link = document.createElement('a');
                        link.download = 'canvas.png';
                        link.href = this.canvas.toDataURL();
                        link.click();
                        link.delete;
                        break;
                    case 'reload':
                        history.go(-1);
                        break;
                    case 'help':
                        help.hidden = false;
                        break;
                    default:
                }
                event.target.blur();
            });
        });
        
        // Keyboard shortcuts
        window.addEventListener('keyup', event => {
            event.preventDefault();
            if (!event.ctrlKey && !event.altKey) {
                const char = event.key;
                const digit = char.match(/\d/)?.input;
                if (digit) {
                    // Set number of sides or points (0 - 9)
                    if (this.current_curve.shape?.order) {
                        this.current_curve.shape.order = digit;
                    }
                }
                else {
                    switch(char) {
                        case 'Escape':
                            // Clear drawing
                            this.#clear_canvas();
                            break;
                        case '*':
                            // Start again from scratch
                            location.reload();
                            break;
                        case ' ':
                            // Toggle play/pause
                            this.paused = !this.paused;
                            const button = this.buttons.filter(button => button.id == 'pause')[0];
                            if (!this.paused) {     // User wants to continue playing
                                button.textContent = 'Pause';
                                this.frame_request = requestAnimationFrame(this.update.bind(this));
                            }
                            else {                  // User wants to pause
                                cancelAnimationFrame(this.frame_request);
                                button.textContent = 'Play';
                            }
                            button.blur();
                            break;
                        default:
                    }
                }
                this.#update_parameter_display();
            }
        });
    }

    // Curve checkboxes
    #create_curve_checkboxes() {
        const checkbox_wrapper = document.querySelector('section#controls #checkbox-wrapper');
        const checkbox = checkbox_wrapper.firstElementChild;
        const checkbox_clone = checkbox.cloneNode(true);
        checkbox_wrapper.innerHTML = '';
        this.curve_checkboxes = [];
        this.curve_labels = [];
        for (const curve_name of this.curve_names){
            const curve_switch = checkbox_clone.cloneNode(true);
            checkbox_wrapper.appendChild(curve_switch);
            const label = curve_switch.querySelector('label');
            label.textContent = curve_name;
            const colour = this.curves[curve_name].colour;
            label.style.color = colour;
            label.id = curve_name;
            this.curve_labels.push(label);
            const input = curve_switch.querySelector('input');
            input.type = 'checkbox';
            input.checked = this.active_curves.includes(this.curves[curve_name]);
            input.name = curve_name;
            this.curve_checkboxes.push(input);
            // Create event listener for when user clicks a curve's checkbox to show/hide it
            input.addEventListener('change', event => {
                const curve = this.curves[event.target.name];
                curve.hidden = !curve.hidden;
                this.active_curves = this.curve_names
                    .filter(name => !this.curves[name].hidden)
                    .map(name => this.curves[name]);
                // If user hides current curve, set current curve to the next active one
                if (curve.hidden && curve == this.current_curve) {
                    if (this.active_curves.length) {
                        this.current_curve = this.active_curves[0];
                    }
                    else {      // unless that was the last active curve, in which case set it to the first of all curves
                        this.current_curve = this.curves[this.curve_names[0]];
                    }
                }
                // Set the newly-unhidden curve to be the current curve
                else if (!curve.hidden) {
                    this.current_curve = curve;
                }
                event.target.blur();
                // and if user has hidden a curve other than the current curve, all we do is update the checkboxes
                this.#update_curves_listing();
                this.function_ui_needs_updating = true;
                this.#update_parameter_display();
            });
        }
        const curves_toggler = document.getElementById('curves-toggler');
        curves_toggler.addEventListener('click', _ => {
            const hidden = checkbox_wrapper.classList.toggle('hidden');
            curves_toggler.textContent = hidden ? '►' : (checkbox_wrapper.scrollIntoView({behavior: "smooth", block: "start"}), '▼');
        });
    }

    #update_curves_listing() {
        this.curve_checkboxes.forEach(box => {
            box.checked = !this.curves[box.name].hidden;
        });
        this.curve_labels
            .filter(label => label.id != this.current_curve.name)
            .forEach(label => label.classList.remove('emphasised'));
    }

    #update_current_curve_styling() {
        const curve_label = document.querySelector(`label#${this.current_curve.name}`);
        const curve_option = [...this.curve_select.options].filter(option => option.value == this.current_curve.name)[0];
        const aux_option = [...this.aux_select.options].filter(option => option.value == this.current_curve.aux.name)[0];
        this.curve_select.selectedIndex = curve_option.index;
        this.aux_select.selectedIndex = aux_option.index;
        const colour = this.current_curve.colour;
        curve_label.style.background =
            colour 
            ? '#000' 
            : rg_0;
        curve_label.style.color =
            colour 
            ?? this.plain_colour;
        curve_label.classList.add('emphasised');
        curve_option.style.backgroundColor =
            colour 
            ? '#000' 
            : this.current_curve.default_colour;
        curve_option.style.Color =
            colour 
            ?? '#000';
        this.curve_select.style.color = 
            colour
            ?? this.plain_colour;
        // Set the dropdown's value to the current curve's name 
        this.curve_select.value = this.current_curve.name;
        // Populate the function box
        const func_box = document.querySelector('section#function');
        const markup = `<code>${this.current_curve.func}</code>`;
        const pre = func_box.querySelector('pre') ?? document.createElement('pre');
        pre.innerHTML = markup;
        func_box.querySelector('pre') ?? func_box.appendChild(pre); 
        // Change params editor section to that for the new current curve
        this.#create_param_table();
        this.function_ui_needs_updating = false;
    }
    
    #update_parameter_display() {
        if (this.function_ui_needs_updating) {
            this.#update_current_curve_styling();
        }
        const curve_options = this.curve_select.querySelectorAll('option');
        curve_options.forEach(option => {
            option.style.color = this.curves[option.value].colour;            
        });
        const param_elements = [...document.getElementsByClassName('param')];
        // Hide hub setting for non-hubbed shapes (like polygons)
        [...document.getElementsByClassName('hub-ui')].forEach(el => {
            this.current_curve.shape instanceof HubbedShape ? el.classList.remove('hidden') : el.classList.add('hidden');
        });
        // Hide order setting for rings and moons
        [...document.getElementsByClassName('order-ui')].forEach(el => {
            this.current_curve.shape instanceof Ring || this.current_curve.shape instanceof Moon
                ? el.classList.add('hidden')
                : el.classList.remove('hidden');
        });
        // Hide eccentricity setting for non-rings
        [...document.getElementsByClassName('eccentricity-ui')].forEach(el => {
            this.current_curve.shape instanceof Ring ? el.classList.remove('hidden') : el.classList.add('hidden');
        });
        // Hide polychrome-speed slider unless hue is -1 / colour is null
        [...document.getElementsByClassName('polychrome-speed-ui')].forEach(el => {
            this.current_curve.colour && !this.current_curve.shape.polychrome_stroke ? el.classList.add('hidden') : el.classList.remove('hidden');
        });
        // Hide quadratic curve settings for non-windmills
        [...document.querySelectorAll("[class*=control-ui]")].forEach(el => {
            this.current_curve.shape instanceof Windmill ? el.classList.remove('hidden') : el.classList.add('hidden');
        });
        
        param_elements.forEach(param => {
            switch(param.id) {
                case 'shape':
                    param.value = this.current_curve.shape.constructor.name;
                    break;
                case 'speed':
                    param.value = this.current_curve.speed;
                    break;
                case 'scale':
                    param.value = this.current_curve.scale;
                    const scale_output = param.previousElementSibling.firstElementChild;
                    scale_output.value = this.current_curve.scale;
                    break;
                case 'rotation':
                    param.value = this.current_curve.rotation;
                    break;
                case 'x-control':
                    param.value = this.current_curve.shape.x_control;
                    const x_control_output = param.previousElementSibling.firstElementChild;
                    x_control_output.value = this.current_curve.shape.x_control;
                    break;
                case 'y-control':
                    param.value = this.current_curve.shape.y_control;
                    const y_control_output = param.previousElementSibling.firstElementChild;
                    y_control_output.value = this.current_curve.shape.y_control;
                    break;
                case 'fill':
                    param.checked = this.current_curve.fill;
                    break;
                case 'hue':
                    const hue_output = param.previousElementSibling.firstElementChild;
                    param.value = hue_output.value = 
                        this.current_curve.colour
                            ? this.#get_hue_from_hsl(this.current_curve.colour)
                            : -1
                    hue_output.style.color = this.current_curve.colour ?? this.plain_colour;
                    break;
                case 'stroke-thickness':
                    param.value = this.current_curve.shape.thickness;
                    const stroke_thickness_output = param.previousElementSibling.firstElementChild;
                    stroke_thickness_output.value = this.current_curve.shape.thickness;
                    break;
                case 'polychrome-stroke':
                    param.checked = this.current_curve.shape.polychrome_stroke;
                    break;
                case 'stroke-colour':
                    param.value = this.current_curve.shape.outline;
                    const stroke_colour_output = param.previousElementSibling.firstElementChild;
                    stroke_colour_output.value = this.current_curve.shape.outline;
                    break;
                case 'polychrome-speed':
                    param.value = this.current_curve.polychrome_speed;
                    const polychrome_speed_output = param.previousElementSibling.firstElementChild;
                    polychrome_speed_output.value = this.current_curve.polychrome_speed;
                    break;
                case 'order':
                    param.value = this.current_curve.shape.order;
                    break;
                case 'eccentricity':
                    param.value = this.current_curve.shape.eccentricity;
                    break;
                case 'radius':
                    param.value = this.current_curve.shape.radius;
                    const radius_output = param.previousElementSibling.firstElementChild;
                    radius_output.value = this.current_curve.shape.radius;
                    break;
                case 'hub':
                    param.value = this.current_curve.shape.hub;
                    const hub_output = param.previousElementSibling.firstElementChild;
                    hub_output.value = this.current_curve.shape.hub;
                    break;
                case 'pulse':
                    param.value = this.current_curve.shape.pulse;
                    const pulse_output = param.previousElementSibling.firstElementChild;
                    pulse_output.value = this.current_curve.shape.pulse;
                    break;
                case 'wave-amp':
                    param.value = this.current_curve.shape.wave_amplitude;
                    const wave_amp_output = param.previousElementSibling.firstElementChild;
                    wave_amp_output.value = this.current_curve.shape.wave_amplitude;
                    break;
                case 'wave-freq':
                    param.value = this.current_curve.shape.wave_frequency;
                    const wave_freq_output = param.previousElementSibling.firstElementChild;
                    wave_freq_output.value = this.current_curve.shape.wave_frequency;
                    break;
                case 'aux':
                    param.value = this.current_curve.aux.name;
                    break;
                default:
            }
        });
    }

    #create_params_section() {
        this.aux_select = document.getElementById('aux');
        this.curve_names.forEach(curve_name => {
            const option = new Option(curve_name, curve_name);
            option.style.color = this.curves[curve_name].colour;            
            this.curve_select.add(option);
            const aux_option = option.cloneNode(true);
            this.aux_select.add(aux_option);            
        });
        this.curve_select.style.color = this.current_curve.colour;
        this.curve_select.onchange = event => {
            this.current_curve = this.curves[event.target.value];
            if (this.current_curve.hidden) {
                this.current_curve.hidden = false;
            }
            event.target.style.color = this.current_curve.colour;
            this.function_ui_needs_updating = true;
            this.#update_parameter_display();
            this.#update_curves_listing();
            event.target.blur();
        };

        this.param_details.addEventListener('change', event => {
            event.preventDefault();
            const param = event.target.id;
            let value;
            switch(param) {
                case 'shape':
                    value = event.target.selectedOptions[0].value;
                    // When user changes shape, carry forward as many attributes as possible from the old shape
                    const common_params = [
                        this.current_curve.fill,
                        this.current_curve.shape.outline,     // outline colour
                        this.current_curve.shape.thickness,   // outline thickness
                        this.current_curve.shape.pulse,
                        this.current_curve.shape.wave_amplitude,
                        this.current_curve.shape.wave_frequency
                    ];
                    switch (value) {
                        case 'Polygon':
                            this.current_curve.shape = new Polygon(
                                ...common_params,
                                this.current_curve.shape.radius,
                                this.current_curve.shape.order ?? 5, 
                            );
                            break;
                        case 'Moon':
                            this.current_curve.shape = new Moon(
                                ...common_params,
                                this.current_curve.shape.radius,
                            );
                            break;
                        case 'Ring':
                            this.current_curve.shape = new Ring(
                                ...common_params,
                                this.current_curve.shape.radius,
                                this.current_curve.shape.hub ?? Math.max(Math.floor(this.current_curve.shape.radius / 4), 1),
                                rand_int(10) / 10,    // eccentricity of ellipse
                            );
                            break;
                        case 'Star':
                            this.current_curve.shape = new Star(
                                ...common_params,
                                this.current_curve.shape.radius, 
                                this.current_curve.shape.hub ?? Math.max(Math.floor(this.current_curve.shape.radius / 4), 1),
                                this.current_curve.shape.order ?? 3,
                            );
                            break;
                        case 'Windmill':
                            this.current_curve.shape = new Windmill(
                                ...common_params,
                                this.current_curve.shape.radius,
                                this.current_curve.shape.order ?? 5, 
                            );
                            break;
                        default:
                            console.log('Invalid shape!');
                    }
                    break;
                case 'speed':
                    value = event.target.selectedOptions[0].value;
                    this.current_curve.speed = Number(value);
                    break;
                case 'scale':
                    value = event.target.value;
                    this.current_curve.scale = Number(value);
                    const scale_output = document.getElementById('scale-output');
                    scale_output.value = value;
                    break;
                case 'rotation':
                    value = event.target.selectedOptions[0].value;
                    this.current_curve.rotation = Number(value);
                    break;
                case 'x-control':
                    value = event.target.value;
                    this.current_curve.shape.x_control = Number(value);
                    const x_control_output = document.getElementById('x-control-output');
                    x_control_output.value = value;
                    break;
                case 'y-control':
                    value = event.target.value;
                    this.current_curve.shape.y_control = Number(value);
                    const y_control_output = document.getElementById('y-control-output');
                    y_control_output.value = value;
                    break;
                case 'fill':
                    value = event.target.checked;
                    this.current_curve.fill = value;
                    break;
                case 'hue':
                    value = Number(event.target.value);
                    this.current_curve.colour =
                        (value == -1)
                            ? null
                            : `hsl(${value} 100% 50%)`;
                    document.getElementById(this.current_curve.name).style.color = this.current_curve.colour;
                    const hue_output = document.getElementById('hue-output');
                    hue_output.style.color = this.current_curve.colour ?? this.plain_colour;
                    hue_output.value = value;
                    this.curve_select.style.color = this.current_curve.colour ?? this.plain_colour;
                    // Whether hue is -1 or in [0, .., 359] determines whether we show the Polychrome Speed UI -
                    // But this gets handled in this.#update_parameter_display(), called after this switch
                    break;
                case 'stroke-thickness':
                    value = event.target.value;
                    this.current_curve.shape.thickness = Number(value);
                    const stroke_thickness_output = document.getElementById('stroke-thickness-output');
                    stroke_thickness_output.value = value;
                    break;
                case 'polychrome-stroke':
                    value = event.target.checked;
                    this.current_curve.shape.polychrome_stroke = value;
                    break;
                case 'stroke-colour':
                    value = event.target.value;
                    const stroke_colour_output = document.getElementById('stroke-colour-output')
                    stroke_colour_output.value = value;
                    this.current_curve.shape.outline = value;
                    break;
                case 'polychrome-speed':
                    value = event.target.value;
                    this.current_curve.polychrome_speed = Number(value);
                    const polychrome_speed_output = document.getElementById('pulse-output');
                    polychrome_speed_output.value = value;
                    break;
                case 'eccentricity':
                    value = event.target.selectedOptions[0].value;
                    this.current_curve.shape.eccentricity = Number(value);
                    break;
                case 'order':
                    value = event.target.selectedOptions[0].value;
                    this.current_curve.shape.order = Number(value);
                    break;
                case 'radius':
                    value = event.target.value;
                    this.current_curve.shape.radius = Number(value);
                    const radius_output = document.getElementById('radius-output');
                    radius_output.value = value;
                    break;
                case 'hub':
                    value = event.target.value;
                    this.current_curve.shape.hub = Number(value);
                    const hub_output = document.getElementById('hub-output');
                    hub_output.value = value;
                    break;
                case 'pulse':
                    value = event.target.value;
                    this.current_curve.shape.pulse = Number(value);
                    const pulse_output = document.getElementById('pulse-output');
                    pulse_output.value = value;
                    break;
                case 'wave-amp':
                    value = event.target.value;
                    this.current_curve.shape.wave_amplitude = Number(value);
                    const wave_amp_output = document.getElementById('wave-amp-output');
                    wave_amp_output.value = value;
                    break;
                case 'wave-freq':
                    value = event.target.value;
                    this.current_curve.shape.wave_frequency = Number(value);
                    const wave_freq_output = document.getElementById('wave-freq-output');
                    wave_freq_output.value = value;
                    break;
                case 'aux':
                    value = event.target.selectedOptions[0].value;
                    this.current_curve.aux = this.curves[value];
                    break;
                default:
                    break;
            }
            this.#update_parameter_display();
        });
        this.#update_parameter_display();
    }

    #create_advanced_section() {
        const inputs = [...document.querySelectorAll('#advanced-table input')];
        inputs.forEach(input => {
            input.value = this.property_map[input.id]();
            input.parentElement.previousElementSibling.firstElementChild.textContent = input.value;   // targets the <output> element
            input.addEventListener('change', _ => {
                const value = input.value;
                this.property_map[input.id](value);
                input.style.backgroundColor = value;
                input.parentElement.previousElementSibling.firstElementChild.textContent = value;   // as above
            });
        });
    }

    #initialise_buttons() {
        this.buttons.filter(button => button.id == 'pause')[0].textContent = 'Pause';
        this.buttons.filter(button => button.id == 'mirror')[0].textContent = 'Mirror';
    }

    #get_random_colour() {
        const r = rand_int(340);
        return `hsl(${(r) + (r > 100 ? 20 : 0)} 100% 50%)`;
    }

    #get_hue_from_hsl(hsl_colour) {
        return hsl_colour ? hsl_colour.split(' ')[0].split('(')[1] : -1;
    }

    #get_random_shape() {
        const common_params = [true, this.default_stroke_colour, 1, 0, 0, 0.3];
        let r;
        switch(rand_int(this.shapes.length)) {
            case 0:
                return new Polygon(...common_params, rand_in_range(6, 96), rand_in_range(3, 12));
            case 1:
                return new Moon(...common_params, rand_in_range(6, 96));            
            case 2:
                r = rand_in_range(6, 96);
                return new Ring(...common_params, r, Math.floor(r / 4), rand_int(10) / 10);
            case 3:
                r = rand_in_range(6, 96);
                return new Star(...common_params, r, Math.floor(r / 4), rand_in_range(3, 12));
            case 4:
                r = rand_in_range(6, 96);
                return new Windmill(...common_params, r, Math.floor(r / 4), rand_in_range(3, 12));
            default:
        }
    }

    #transform_to_canvas([x, y]) {
        return [
            Math.floor((x + 1) / 2 * this.width),
            Math.floor((y + 1) / 2 * this.height)
        ];
    }

    #clear_canvas() {
        this.ctx.fillStyle = this.canvas.style.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.progress = 0;
        return;
    }

    #create_param_table() {
        let i = 0;
        this.tbody.innerHTML = '';
        for (const param of this.current_curve.params) {
            const row = this.row_template.cloneNode(true);
            row.firstElementChild.textContent = this.current_curve.param_names[i];
            const input = row.querySelector('input');
            input.id = `param-${i++}`;
            input.value = param;
            this.tbody.appendChild(row);
            input.onchange = event => {
                this.current_curve.params[~~(event.target.id.slice(6))] = Number(event.target.value);
            };
        }
    }

    render() {
        super.render();
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.#update_parameter_display();
        this.update();
    }

    // Critical method called each frame by requestAnimationFrame()
    update() {
        super.update();
        for (let i = 0; i < this.curve_names.length; i++) {
            const curve = this.curves[this.curve_names[i]];
            const shape = curve.shape;
            if (!curve.hidden) {
                let [x_raw, y_raw] = curve.func(...curve.params, this.progress * curve.speed + curve.seed);
                [x_raw, y_raw] = [x_raw * curve.scale, y_raw * curve.scale];
                let [x, y] = this.#transform_to_canvas([x_raw, y_raw]);
                if (curve.aux !== curve) {
                    let [x_aux, y_aux] = curve.aux.func(...curve.aux.params, this.progress * curve.speed + curve.seed);
                    [x_aux, y_aux] = [x_aux * curve.scale, y_aux * curve.scale];
                    [x_aux, y_aux] = this.#transform_to_canvas([x_aux, y_aux]);
                    [x, y] = [(x + x_aux) / 2, (y + y_aux) / 2];
                }
                this.ctx.save();
                const [nx, ny] = [shape.y_last - y, x - shape.x_last];
                const mag = Math.sqrt(nx * nx + ny * ny);
                shape.normal = mag ? {x: nx / mag, y: ny / mag} : {x: 0, y: 0};
                [shape.x_last, shape.y_last] = [x, y];
                let x_ = x + shape.wave_amplitude * Math.sin(this.progress * shape.wave_frequency) * shape.normal.x;
                let y_ = y + shape.wave_amplitude * Math.sin(this.progress * shape.wave_frequency) * shape.normal.y;
                [x_, y_] = [(x_ - this.width / 2) * this.global_scale + this.width / 2, (y_ - this.height / 2) * this.global_scale + this.height / 2];
                this.ctx.translate(x_, y_);
                this.ctx.rotate(curve.rotation * this.progress);
                shape.polychrome_speed = curve.polychrome_speed;
                shape.fill = curve.fill;
                shape.draw(this.ctx, 0, 0, curve.colour, this.progress);
                this.ctx.restore();
                if (this.mirrored) {
                    this.ctx.save();
                    this.ctx.translate(this.width - x_, y_);        // left-right; reflect in y axis
                    this.ctx.rotate(-curve.rotation * this.progress);
                    shape.draw(this.ctx, 0, 0, curve.colour, this.progress);
                    this.ctx.restore();
                    this.ctx.save();
                    this.ctx.translate(x_, this.height - y_);       // top-bottom; reflect in x axis
                    this.ctx.rotate(-curve.rotation * this.progress);
                    shape.draw(this.ctx, 0, 0, curve.colour, this.progress);
                    this.ctx.restore();
                    this.ctx.save();
                    this.ctx.translate(this.width - x_, this.height - y_);  // both ways; reflect in line y = x
                    this.ctx.rotate(curve.rotation * this.progress);
                    shape.draw(this.ctx, 0, 0, curve.colour, this.progress);
                    this.ctx.restore();
                }
            }
        }
        if (!this.paused) {
            this.frame_request = requestAnimationFrame(this.update.bind(this));
        }    
    }
}
// End of CurveScene class.   Now we define Shape class and its children...

class Shape {
    constructor(fill, outline, thickness, pulse, wave_amplitude, wave_frequency) {
        this.type = this.constructor.name;
        this.fill = fill;
        this.outline = outline;
        this.thickness = thickness;
        this.hidden = false;
        this.pulse = pulse;
        this.x_last = 0;
        this.y_last = 0;
        this.normal = null;
        this.wave_amplitude = wave_amplitude;
        this.wave_frequency = wave_frequency;
        this.hue_seed = rand_int(360);
    }
    draw(ctx, progress, colour) {
        // Must be called by child class draw() methods to do filling and stroking!
        // Conditionally do the filling and stroking after the child classes have drawn their stuff
        if (this.thickness) {
            ctx.lineWidth = this.thickness;
            if (!this.polychrome_stroke) {
                ctx.strokeStyle = this.outline;
            }
            else {
                const r = (370 - (Math.sin((progress / 16) * (this.polychrome_speed / 25))
                * 170 + 170) + this.hue_seed) % 340;    // desync from polychrome fill and other polychrome-stroked shapes
                ctx.strokeStyle = `hsl(${r + (r > 100 ? 20 : 0)} 100% 50%)`;    // too much of garish greens!
            }
            ctx.stroke();
        }
        if (this.fill) {
            if (colour) {
                ctx.fillStyle = colour;
            }
            else {
                const r = Math.sin((progress / 16) * (this.polychrome_speed / 25))
                * 170 + 170;
                ctx.fillStyle = `hsl(${r + (r > 100 ? 20 : 0)} 100% 50%)`;    // just cut out 20 degrees of garish greens!
            }
            ctx.fill();
        }
    }
}

class Polygon extends Shape {
    static instance_count = 0;
    constructor(fill, outline, thickness, pulse, wave_amplitude, wave_frequency, radius, order) {
        super(fill, outline, thickness, pulse, wave_amplitude, wave_frequency);
        this.id = Polygon.instance_count++;
        this.radius = radius;
        this.order = order;
    }
    draw(ctx, x, y, colour, progress) {
        let r = this.radius;
        if (this.pulse) {
            r +=  Math.max(-r + 1, this.pulse * Math.sin(progress) * r);
        }
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.moveTo(0, r);
        for (let i = 0; i < this.order; i++) {
            ctx.rotate(2 * Math.PI / this.order);
            ctx.lineTo(0, r);
        }
        ctx.closePath();
        super.draw(ctx, progress, colour);
        ctx.restore();
    }
}

class Windmill extends Shape {
    static instance_count = 0;
    constructor(fill, outline, thickness, pulse, wave_amplitude, wave_frequency, radius, order) {
        super(fill, outline, thickness, pulse, wave_amplitude, wave_frequency);
        this.id = Windmill.instance_count++;
        this.radius = radius;
        this.order = order;
        this.x_control = 0;
        this.y_control = -1;
    }
    draw(ctx, x, y, colour, progress) {
        let r = this.radius;
        if (this.pulse) {
            r +=  Math.max(-r + 1, this.pulse * Math.sin(progress) * r);
        }
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.moveTo(0, r);
        for (let i = 0; i < this.order; i++) {
            ctx.rotate(2 * Math.PI / this.order);
            ctx.quadraticCurveTo(this.x_control * r, this.y_control * r, 0, r);
        }
        super.draw(ctx, progress, colour);
        ctx.restore();
    }
}

class Moon extends Shape {
    static instance_count = 0;
    constructor(fill, outline, thickness, pulse, wave_amplitude, wave_frequency, radius) {
        super(fill, outline, thickness, pulse, wave_amplitude, wave_frequency);
        this.id = Moon.instance_count++;
        this.radius = radius;
    }
    draw(ctx, x, y, colour, progress) {
        let r = this.radius;
        if (this.pulse) {
            r +=  Math.max(-r + 1, this.pulse * Math.sin(progress) * r);
        }
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, true);
        ctx.arcTo(- r / 2, 0, 0, -r, 2 * r);
        ctx.closePath();
        super.draw(ctx, progress, colour);
        ctx.restore();
    }
}

class HubbedShape extends Shape {
    // Meant to be an abstract class, don't instantiate!
    static instance_count = 0;
    constructor(fill, outline, thickness, pulse, wave_amplitude, wave_frequency, radius_outer, radius_inner) {
        super(fill, outline, thickness, pulse, wave_amplitude, wave_frequency);
        this.radius = radius_outer;
        this.hub = radius_inner;
    }
    draw(ctx, progress, colour) {
        super.draw(ctx, progress, colour);
    }
}

class Ring extends HubbedShape {
    static instance_count = 0;
    constructor(fill, outline, thickness, pulse, wave_amplitude, wave_frequency, radius_outer, radius_inner, eccentricity) {
        super(fill, outline, thickness, pulse, wave_amplitude, wave_frequency, radius_outer, radius_inner);
        this.id = Ring.instance_count++;
        this.eccentricity = eccentricity;
    }
    draw(ctx, x, y, colour, progress) {
        let r = this.radius;
        if (this.pulse) {
            r +=  Math.max(-r + 1, this.pulse * Math.sin(progress) * r);
        }
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * this.eccentricity, 0, 0, 2 * Math.PI);        
        super.draw(ctx, progress, colour);
        // Finally, draw the hub
        ctx.fillStyle = 'hsla(0, 0%, 0%, 1)';
        ctx.beginPath();
        ctx.ellipse(x, y, this.hub, this.hub * this.eccentricity, 0, 0, 2 * Math.PI);
        if (this.fill) ctx.fill();
    }
}

class Star extends HubbedShape {
    static instance_count = 0;
    constructor(fill, outline, thickness, pulse, wave_amplitude, wave_frequency, radius_outer, radius_inner, order) {
        super(fill, outline, thickness, pulse, wave_amplitude, wave_frequency, radius_outer, radius_inner);
        this.id = Star.instance_count++;
        this.order = order;
    }
    draw(ctx, x, y, colour, progress) {
        let r = this.radius;
        if (this.pulse) {
            r +=  Math.max(-r + 1, this.pulse * Math.sin(progress) * r);
        }
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.moveTo(0, r);
        for (let i = 0; i < this.order; i++) {
            ctx.lineTo(0, r);
            ctx.rotate(Math.PI / this.order);
            ctx.lineTo(0, this.hub);
            ctx.rotate(Math.PI / this.order);
        }
        ctx.closePath();
        super.draw(ctx, progress, colour);
        ctx.restore();
    }
}
// end of classes
// ============================

function init() {
    const {width: main_width, height: main_height} = main.getBoundingClientRect();
    canvas.width = Math.floor(main_width - 200);
    canvas.height = main_height;
    const scene = new CurveScene(canvas, Curves);
    scene.render();
}

// Utility functions
const rand_in_range = (m, n) => Math.floor((n - m) * Math.random() + m);
const rand_int = n => Math.floor(n * Math.random());

// Main (top-level) code
let debug = false;
const rg_0 = 'radial-gradient(#0000ff, #990029)';
const main = document.getElementById('main');
const canvas = document.querySelector('canvas');

const help = document.querySelector('aside#help');
document.querySelector('aside#help button#hide').addEventListener('click', _ => {
    help.hidden = true;
});

window.addEventListener('load', init);
window.addEventListener('resize', _ => location.reload());
