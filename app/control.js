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
    debug = false;

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

        if (!color.r) {color.r = 120}
        if (!color.g) {color.g = 120}
        if (!color.b) {color.b = 120}
        if (!color.a) {color.a = 1}

        return new Color(color.r, color.g, color.b, color.a)

    }

    return {
        shape: function(obj){
            switch(obj.shape){
                case 'prism':
                    iso.add(
                        Shape.Prism(
                            new Point(
                                obj.parameters.position.x,
                                obj.parameters.position.y,
                                obj.parameters.position.z
                            ),
                            obj.parameters.size.x,
                            obj.parameters.size.y,
                            obj.parameters.size.z
                        )
                    );
                    //console.log('prism');
                    break;
                case 'grid':
                    mapLayers.grid(obj.parameters.size, color(obj.parameters.color), obj.parameters.centred);
                    break;
                case 'octahedron':
                    //
                    var octahedronObj = objects.Octahedron(
                        new Point(
                            obj.parameters.position.x,
                            obj.parameters.position.y,
                            obj.parameters.position.z
                        )
                    );

                    if (obj.parameters.rotate){
                        for (var i = 0; i < obj.parameters.rotate.length; i++) {
                            var rotateObj = obj.parameters.rotate[i];
                            //console.log(rotateObj)
                            if (!rotateObj.angle) rotateObj.angle = function(){return angle};
                            octahedronObj = octahedronObj[obj.parameters.rotate[0].name](
                                new Point(obj.parameters.position.x+rotateObj.x,obj.parameters.position.y+rotateObj.y,obj.parameters.position.z+rotateObj.z),rotateObj.angle()
                            );
                        }
                    }



                    iso.add(octahedronObj, color(obj.parameters.color));
                    break;

                default:
                    break;
            }
        }
    }
});


app.controller('control', ['$scope', '$route', '$routeParams', '$timeout', '$uibTooltip', 'objects', 'mapLayers', 'visualFunction', 'serialize', '$location',
    function ($scope, $route, $routeParams, $timeout, $uibTooltip, objects, mapLayers, visualFunction, serialize, $location) {

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
                    shape: 'prism',
                    functionType: 'cubic',
                    parameters: {
                        position: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        size: {
                            x: 10,
                            y: 10,
                            z: 0
                        }
                    },
                    name: 'Площадка'
                },
                {
                    shape: 'prism',
                    functionType: 'cubic',
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
                    parameters: {
                        size: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        position: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        rotate: [
                            {
                                name: 'rotateZ',
                                x: 0.5,
                                y: 0.5,
                                z: 0,
                                angle: function(){
                                    return angle
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


    $scope.buttonCtrl = function (obj, type, index) {
        console.log(obj);
        console.log(obj.selected);
        if (!!obj.selected === false){
            obj.selected = true;

            var key = type;

            for (var i = 0; i < $scope.model.layers.storage.length; i++) {
                var layer = $scope.model.layers.storage[i];
                layer.selected = false;
            }


            if(index || index == 0){
                $scope.model.cubic.tooltipModel = $scope.model.layers.storage[index].parameters;
                obj.selected = true;
                //console.log($scope.model.cubic.tooltipModel);
            }

            //routeParamsModel  - доделать роутер

            $location.hash(key);

            switch (key) {
                case 'cubic':
                    angular.forEach($scope.model, function (value, key) {
                        value.status = false;
                    });

                    $scope.model[key].status = true;
                    $scope.templateBind = 'modal-' + key;
                    break;

                case 'dropper':
                    $scope.model[key].status = true;
                    $scope.templateBind = 'modal-' + key;
                    break;

                default:
                    console.log('Ключ объекта не определён: ' + key);
                    break;
            }

        } else {
            $location.hash('');
            //hidePopover;
            $scope.model[key].status = false;
            $scope.templateBind = false;
        }

        //console.log($scope.templateBind);

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

            //console.log(angle)

            if (debug){
                console.log($scope.model.layers.storage)
            }

            for (var i = 0; i < $scope.model.layers.storage.length; i++) {
                if ($scope.model.layers.storage[i]){
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