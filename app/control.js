var app = angular.module('app', ['ngRoute', 'ui.bootstrap', 'dndLists', 'colorpicker.module'])

.config(['$routeProvider', '$httpProvider' ,'$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.common = 'Content-Type: application/json';
    //$httpProvider.defaults.headers.common = 'Accept: application/json';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //TODO: Вызывает эроры,
    //если стрнет то выкинет на логинн
    $routeProvider.otherwise({redirectTo: '/'});
    //    добовляем провайдеру Interceptor (см в вюм-логин)
    //$httpProvider.interceptors.push('authInterceptor');

    //debug($locationProvider);
}]);

var iso = new Isomer(document.getElementById("canvas"));
var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

//TODO: вынести в фактори
//TODO: внести углы в контролеры или фактори
var angle = 0,
    time = 0,
    debug = false;

var world = [
    [
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
    ],
    [
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,1 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,1 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
    ],
    [
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,1 ,1 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,1 ,1 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,1 ,1 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,1 ,1 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
    ],
    [
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,1 ,1 ,1 ,1 ,0 ,0 ,0],
        [0, 0, 0 ,1 ,1 ,1 ,1 ,0 ,0 ,0],
        [0, 0, 0 ,1 ,1 ,1 ,1 ,0 ,0 ,0],
        [0, 0, 0 ,1 ,1 ,1 ,1 ,0 ,0 ,0],
        [0, 0, 0 ,1 ,1 ,1 ,1 ,0 ,0 ,0],
        [0, 0, 0 ,1 ,1 ,1 ,1 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
    ],
    [
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
        [0, 0, 1 ,1 ,1 ,1 ,1 ,1 ,0 ,0],
        [0, 0, 1 ,1 ,1 ,1 ,1 ,1 ,0 ,0],
        [0, 0, 1 ,1 ,1 ,1 ,1 ,1 ,0 ,0],
        [0, 0, 1 ,1 ,1 ,1 ,1 ,1 ,0 ,0],
        [0, 0, 1 ,1 ,1 ,1 ,1 ,1 ,0 ,0],
        [0, 0, 1 ,1 ,1 ,1 ,1 ,1 ,0 ,0],
        [0, 0, 1 ,1 ,1 ,1 ,1 ,1 ,0 ,0],
        [0, 0, 1 ,1 ,1 ,1 ,1 ,1 ,0 ,0],
        [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
    ],
    [
        [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
        [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
        [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
        [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
        [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
        [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
        [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
        [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
        [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
        [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1]
    ]
];

world = world.reverse();

app.factory('animation', function(){

    function cubicBezier(x1, y1, x2, y2, epsilon){

        var curveX = function(t){
            var v = 1 - t;
            return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
        };

        var curveY = function(t){
            var v = 1 - t;
            return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
        };

        var derivativeCurveX = function(t){
            var v = 1 - t;
            return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
        };

        return function(t){

            var x = t, t0, t1, t2, x2, d2, i;

            // First try a few iterations of Newton's method -- normally very fast.
            for (t2 = x, i = 0; i < 8; i++){
                x2 = curveX(t2) - x;
                if (Math.abs(x2) < epsilon) {
                    return curveY(t2);
                }
                d2 = derivativeCurveX(t2);
                if (Math.abs(d2) < 1e-6) break;
                t2 = t2 - x2 / d2;
            }

            t0 = 0, t1 = 1, t2 = x;

            if (t2 < t0) return curveY(t0);
            if (t2 > t1) return curveY(t1);

            // Fallback to the bisection method for reliability.
            while (t0 < t1){
                x2 = curveX(t2);
                if (Math.abs(x2 - x) < epsilon) return curveY(t2);
                if (x > x2) t0 = t2;
                else t1 = t2;
                t2 = (t1 - t0) * .5 + t0;
            }

            // Failure
            return curveY(t2);

        };

    };

    return {
        cubicBezier: function(c1,y1,x2,y2,epsilon){
            return cubicBezier(c1,y1,x2,y2,epsilon);
        }
    }
});
app.factory('objects', function () {
    return {
        Stairs: function(origin) {
            var STEP_COUNT = 10;

            /* Create a zig-zag */
            var zigzag = new Path(origin);
            var steps = [], i;

            /* Shape to return */
            var stairs = new Shape();

            for (i = 0; i < STEP_COUNT; i++) {
                /**
                 *  2
                 * __
                 *   | 1
                 */

                var stepCorner = origin.translate(0, i / STEP_COUNT, (i + 1) / STEP_COUNT);
                /* Draw two planes */
                steps.push(new Path([
                    stepCorner,
                    stepCorner.translate(0, 0, -1 / STEP_COUNT),
                    stepCorner.translate(1, 0, -1 / STEP_COUNT),
                    stepCorner.translate(1, 0, 0)
                ]));

                steps.push(new Path([
                    stepCorner,
                    stepCorner.translate(1, 0, 0),
                    stepCorner.translate(1, 1 / STEP_COUNT, 0),
                    stepCorner.translate(0, 1 / STEP_COUNT, 0)
                ]));

                zigzag.push(stepCorner);
                zigzag.push(stepCorner.translate(0, 1 / STEP_COUNT, 0));
            }

            zigzag.push(origin.translate(0, 1, 0));


            for (i = 0; i < steps.length; i++) {
                stairs.push(steps[i]);
            }
            stairs.push(zigzag);
            stairs.push(zigzag.reverse().translate(1, 0, 0));

            return stairs;
        },
        Octahedron: function (origin) {
            /* Declare the center of the shape to make rotations easy */
            var center = origin.translate(0.5, 0.5, 0.5);
            var faces = [];

            /* Draw the upper triangle /\ and rotate it */
            var upperTriangle = new Path([
                origin.translate(0, 0, 0.5),
                origin.translate(0.5, 0.5, 1),
                origin.translate(0, 1, 0.5)
            ]);

            var lowerTriangle = new Path([
                origin.translate(0, 0, 0.5),
                origin.translate(0, 1, 0.5),
                origin.translate(0.5, 0.5, 0)
            ]);

            for (var i = 0; i < 4; i++) {
                faces.push(upperTriangle.rotateZ(center, i * Math.PI / 2));
                faces.push(lowerTriangle.rotateZ(center, i * Math.PI / 2));
            }

            /* We need to scale the shape along the x & y directions to make the
             * sides equilateral triangles */
            return new Shape(faces).scale(center, Math.sqrt(2)/2, Math.sqrt(2)/2, 1);
        }
    }
});
app.factory('mapLayers', function () {
    return {
        land: function(origin, sizeXYZ, color) {
            //console.log(origin)

            //TOP
            var prism = new Shape();


            for (var z = 0; z < sizeXYZ.length; z++) {
                var sizeXY = sizeXYZ[z];
                for (var y = 0; y < sizeXY.length; y++) {
                    var sizeX = sizeXY[y];
                    for (var x = 0; x < sizeX.length; x++) {

                        if (sizeX[x] != 1) continue;

                        /* Squares parallel to the x-axis */
                        var face1 = new Path([
                            new Point(x    , y    , z    ),
                            new Point(x + 1, y    , z    ),
                            new Point(x + 1, y    , z + 1),
                            new Point(x    , y    , z + 1)
                        ]);

                        /* Push this face and its opposite */
                        //if (sizeXYZ[z+1] == 1) {
                            prism.push(face1);
                        //};
                        //
                        /* Square parallel to the y-axis */
                        var face2 = new Path([
                            new Point(x    , y    , z    ),
                            new Point(x    , y    , z + 1),
                            new Point(x    , y + 1, z + 1),
                            new Point(x    , y + 1, z    )
                        ]);

                        //Левая грань
                        //if (false){
                        //    prism.push(face2);
                        //}
                        if (y>=1 && sizeXY[y-1][x] == sizeXY[y][x]){
                            continue;
                        }

                        var face3 = new Path([
                            new Point(x    , y    , z    ),
                            new Point(x + 1, y + 0, z + 0),
                            new Point(x + 1, y + 1, z + 0),
                            new Point(x + 0, y + 1, z + 0)
                        ]);

                        //console.log('ger')
                        prism.push(face3.translate(0, 0, 1));


                    }
                }
            }

            /* This surface is oriented backwards, so we need to reverse the points */

            return prism;

        },
        grid: function(size, color, centred) {
            var x, y;

            if (centred){
                for (x = -size.x; x <= size.x; x++) {
                    iso.add(new Path([
                        new Point(x, -size.x, 0),
                        new Point(x,  size.y, 0),
                        new Point(x, -size.x, 0)
                    ]), color);
                }
                for (y = -size.x; y <= size.y; y++) {
                    iso.add(new Path([
                        new Point(-size.x, y, 0),
                        new Point( size.x, y, 0),
                        new Point(-size.x, y, 0)
                    ]), color);
                }
            } else {

                for (x = 0; x < size.x; x++) {
                    iso.add(new Path([
                        new Point(x, 0, 0),
                        new Point(x, size.y, 0),
                        new Point(x, 0, 0)
                    ]), color);
                }
                for (y = 0; y < size.y; y++) {
                    iso.add(new Path([
                        new Point(0, y, 0),
                        new Point(size.x, y, 0),
                        new Point(0, y, 0)
                    ]), color);
                }
            };

            iso.add(new Path([
                Point.ORIGIN,
                new Point(0, 0, size.z),
                Point.ORIGIN
            ]), color);

        }
    }
});
app.factory('visualFunction', function () {
    return {
        randomColor: function () {
            return new Color(
                parseInt(Math.random() * 256),
                parseInt(Math.random() * 256),
                parseInt(Math.random() * 256));
        },
    }
});

app.factory('serialize', function(mapLayers, objects){

    function color(color){
        switch (Object.prototype.toString.call(color)){
            case '[object Object]':
                //console.log(color);
                return new Color(color.r, color.g, color.b, color.a);
                break;
            case '[object String]':
                var colorArray = color.split(',');
                return new Color(colorArray[0], colorArray[1], colorArray[2], colorArray[3]);
                break;
            default:
                console.log(color);
                break;
        }
    }

    return {
        shape: function(obj){

            var colorObj,
                shape,
                sizeObj,
                startPos;

            //position
            if (obj.parameters && obj.parameters.position){
                startPos = new Point(
                    obj.parameters.position.x,
                    obj.parameters.position.y,
                    obj.parameters.position.z
                );
            }

            //color
            if (obj.parameters && obj.parameters.color.string){
                colorObj = color(obj.parameters.color.string.replace(/[^\d.,-]/g, ''));
            } else {
                colorObj = color(obj.parameters.color);
            }

            //shape picker
            //TODO: вынести общую логику в общий объект, да бы выкинуть iso.add, add rotate на следующий лейр
            switch(obj.shape){
                case 'prism':
                    shape = Shape.Prism(startPos,obj.parameters.size);
                    break;
                case 'land':
                    shape = mapLayers.land(startPos, obj.parameters.size, colorObj);
                    break;
                case 'grid':
                    //TODO: подумать о mapLayers'ah
                    mapLayers.grid(obj.parameters.size, colorObj, obj.parameters.centred);
                    return false;
                    break;
                case 'octahedron':
                    shape = objects.Octahedron(startPos);
                    break;
                default:
                    break;
            }

            //add rotate
            if (obj.parameters.rotate){
                for (var i = 0; i < obj.parameters.rotate.length; i++) {
                    var rotateObj = obj.parameters.rotate[i];

                    if (!(rotateObj.name == 'rotateX' || rotateObj.name == 'rotateY' || rotateObj.name == 'rotateZ')) {
                        console.log(rotateObj.name);
                        console.log('Не указан rotate');
                        return false;
                    };

                    if (!rotateObj.angle) rotateObj.angle = function(){
                        var epsilon = (1000 / 60 / time);
                        return 2*Math.PI*animation.cubicBezier(0.25,0.25,0.75,0.75, epsilon)(time);
                    };

                    shape = shape[obj.parameters.rotate[i].name](
                        new Point(
                            obj.parameters.position.x+rotateObj.x,
                            obj.parameters.position.y+rotateObj.y,
                            obj.parameters.position.z+rotateObj.z
                        ),
                        rotateObj.angle()
                    );
                }
            }

            iso.add(shape, colorObj);

        }
    }
});


app.controller('control', ['$scope', '$route', '$routeParams', '$timeout', '$uibTooltip', 'objects', 'mapLayers', 'visualFunction', 'serialize', '$location', 'animation',
    function ($scope, $route, $routeParams, $timeout, $uibTooltip, objects, mapLayers, visualFunction, serialize, $location, animation) {

    //layer: function(){mapLayers.grid({x: 10, y: 10, z: 20}, new Color(0, 0, 0, 0.1), false)},
    //layer: function(){iso.add(objects.Octahedron(new Point(2, 2, -2.5)).rotateZ(new Point(2.5, 2.5, 0), angle), new Color(0, 180, 180))},

    $scope.settings = {
        step: function() {
            return 0.1;
        }
    };

    $scope.model = {
        move: {
            status: false,
            func: function(key){
                //console.log('key');
                var shapeObj = {
                    shape: 'prism',
                    parameters: {
                        position: {
                            x: 2,
                            y: 2,
                            z: 1
                        },
                        size: {
                            x: 10,
                            y: 10,
                            z: 0
                        },
                        color: {
                            r: 100,
                            g: 0,
                            b: 100,
                            a: 1
                        }
                    },
                    name: 'cubic'
                };
                serialize.shape(shapeObj);
            }
        },
        layers: {
            status: false,
            storage: [
                {
                    shape: 'land',
                    isVisible: true,
                    parameters: {
                        position: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        size: world,
                        color: {
                            r: 50,
                            g: 50,
                            b: 50,
                            a: 1
                        }
                    },
                    name: 'Поверхность'
                },
                //{
                //    shape: 'prism',
                //    functionType: 'cubic',
                //    isVisible: true,
                //    parameters: {
                //        position: {
                //            x: 0,
                //            y: 0,
                //            z: 0
                //        },
                //        size: {
                //            x: 10,
                //            y: 10,
                //            z: 0
                //        },
                //        color: {
                //            r: 100,
                //            g: 0,
                //            b: 100,
                //            a: 1
                //        }
                //    },
                //    name: 'Площадка'
                //},
                {
                    shape: 'prism',
                    functionType: 'cubic',
                    isVisible: true,
                    parameters: {
                        position: {
                            x: 1,
                            y: 1,
                            z: 1
                        },
                        size: {
                            x: 1,
                            y: 1,
                            z: 1
                        },
                        rotate: [
                            {
                                name: 'rotateX',
                                x: 0.5,
                                y: 0.5,
                                z: 0,
                                angle: function(){
                                    var epsilon = (1000 / 60 / time);
                                    return 2*Math.PI*animation.cubicBezier(0.5,0.5,0.5,0.5, epsilon)(time);
                                }
                            }
                        ],
                        color: {
                            r: 100,
                            g: 100,
                            b: 100
                        }
                    },
                    name: 'Кубик'
                },
                {
                    shape: 'grid',
                    isVisible: true,
                    parameters: {
                        size: {
                            x: 10,
                            y: 10,
                            z: 20
                        },
                        color: {
                            r: 100,
                            g: 100,
                            b: 100,
                            a: 0.1
                        }
                    },
                    name: 'Сетка'
                },
                {
                    shape: 'octahedron',
                    isVisible: true,
                    parameters: {
                        size: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        position: {
                            x: 1,
                            y: 1,
                            z: 1
                        },
                        rotate: [
                            {
                                name: 'rotateZ',
                                x: 0.5,
                                y: 0.5,
                                z: 0,
                                angle: function(){
                                    var epsilon = (1000 / 60 / time);
                                    return 2*Math.PI*animation.cubicBezier(0.5,0.5,0.5,0.5, epsilon)(time);
                                }
                            },
                            {
                                name: 'rotateX',
                                x: 0.5,
                                y: 0.5,
                                z: 3,
                                angle: function(){
                                    var epsilon = (1000 / 60 / time);
                                    return 2*Math.PI*animation.cubicBezier(0.5,0.5,0.5,0.5, epsilon)(time);
                                }
                            }
                        ],
                        color: {
                            r: 0,
                            g: 180,
                            b: 180,
                            a: 1
                        }
                    },
                    name: 'Октайдер'
                }
            ],
            func: function(key){
                console.log(this);
            }
        },
        expand: {
            status: false,
            func: function(key){
                console.log(this);
            }
        },
        dropper: {
            status: false,
            func: function(key){
                console.log(this);
            }
        },
        eraser: {
            status: false,
            func: function(key){
                console.log(this);
            }
        },
        rotate: {
            status: false,
            func: function(key){
                console.log(this);
            }
        },
        line: {
            status: false,
            func: function(key){
                console.log(this);
            }
        },
        cubic: {
            status: false,
            tooltipModel: {
                size: {},
                position: {}
            },
            func: function(key){

                var model = this.tooltipModel;
                console.log(model);

                var obj = {
                    functionType: 'cubic',
                    shape: 'prism',
                    parameters: clone(model),
                    name: 'Кубик ' + $scope.model.layers.storage.length
                };

                $scope.model.layers.storage.push(clone(obj));
                console.log($scope.model.layers.storage)
            }
        }
    };

    $scope.templateBind = null;

    var toggleCtrl = false;
    $scope.buttonCtrl = function (obj, type, index) {
        if (
             Object.keys(obj).length && !!obj.selected === false ||
            (Object.keys(obj).length == 0 && toggleCtrl === false)
        ){

            if(Object.keys(obj).length == 0){
                //Если новый объект
                toggleCtrl = true;
                console.log(obj);
                $scope.model.cubic.tooltipModel = {};
            } else {
                //Если в листе слоёв
                obj.selected = true;

                if(index || index == 0){
                    $scope.model.cubic.tooltipModel = $scope.model.layers.storage[index].parameters;
                    //console.log($scope.model.cubic.tooltipModel);
                }
            }

            //routeParamsModel  - доделать роутер

            $location.hash(type);

            switch (type) {
                case 'cubic':
                    //TODO: сделать общий сброс
                    angular.forEach($scope.model, function (value, key) {
                        value.status = false;
                    });

                    $scope.model[type].status = true;
                    $scope.templateBind = 'modal-' + type;
                    break;

                case 'dropper':
                    if (obj.parameters && obj.parameters.color){
                        obj.parameters.color.string = 'rgba(' + obj.parameters.color.r + ',' + obj.parameters.color.g + ',' + obj.parameters.color.b + ',' + obj.parameters.color.a + ')';
                    }
                    $scope.model[type].status = true;
                    $scope.templateBind = 'modal-' + type;
                    break;


                case 'rotate':
                    console.log(obj.parameters);
                    $scope.model[type].status = true;
                    $scope.templateBind = 'modal-' + type;
                    break;

                default:
                    console.log('Ключ объекта не определён: ' + type);
                    break;
            }

        } else {

            //Обнуляем JS
            for (var i = 0; i < $scope.model.layers.storage.length; i++) {
                var layer = $scope.model.layers.storage[i];
                layer.selected = false;
            }

            $scope.hidePopover(type);
        }

        //console.log($scope.templateBind);

    };
    $scope.hidePopover = function(type){
        $location.hash('');
        toggleCtrl = false;
        $scope.model[type].status = false;
        $scope.templateBind = false;
    };

    $scope.toolbar = function (key) {

        switch (key){
            case 'move':

                break;
            case 'layers':
                $scope.model[key].func(key);
                break;
            case 'expand':
                $scope.model[key].func(key);
                break;
            case 'dropper':
                $scope.model[key].func(key);
                break;
            case 'eraser':
                $scope.model[key].func(key);
                break;
            case 'rotate':
                $scope.model[key].func(key);
                break;
            case 'line':
                $scope.model[key].func(key);
                break;
            case 'cubic':
                $scope.model[key].func(key);
                break;
            default:
                console.error(key);
                break;
        }
    };

    $scope.dragFunction = (function () {
        return{
            onDragstart: function(layer, event) {
                initAnimationFrame.stop();
                //TODO: сделать курсор о том что драг начался
                event.dataTransfer.dropEffect = "copy";
                //if (event.dataTransfer.setDragImage) {
                //    console.log(event.dataTransfer)
                //      var img = new Image();
                //      img.src = 'framework/vendor/ic_content_copy_black_24dp_2x.png';
                //      event.dataTransfer.setDragImage(img, 0, 0);
                //}
            },
            onDragend: function (event){
                debug = true;
                $timeout((function() {
                    initAnimationFrame.start();
                }), 1000);
            },
            onDrop: function(event, index, layer){
                initAnimationFrame.start();
                return layer;
            }
        }
    }());

    var initAnimationFrame = (function() {
        var requestId;

        function loop() {
            angle += Math.PI / 90;

            if (time >= 1){time = 0}
            time += 0.01;

            if (debug){
                console.log($scope.model.layers.storage)
            }

            for (var i = 0; i < $scope.model.layers.storage.length; i++) {
                if ($scope.model.layers.storage[i] && $scope.model.layers.storage[i].isVisible){
                    serialize.shape($scope.model.layers.storage[i]);
                }
            }

            debug = false;

            requestId = window.requestAnimationFrame(loop, iso);
        }

        function start() {
            if (!requestId) {
                loop();
            }
        }

        function stop() {
            if (requestId) {
                window.cancelAnimationFrame(requestId);
                requestId = undefined;
            }
        }

        return {
            start: start,
            stop:  stop
        }
    })();


    $scope.routeParamsModel = $location;

    if ($scope.routeParamsModel.hash()){
        $scope.buttonCtrl({}, $scope.routeParamsModel.hash())
    }

    initAnimationFrame.start();

}]);