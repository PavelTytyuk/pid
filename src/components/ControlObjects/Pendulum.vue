<script>
import Matter from 'matter-js'
import Matrix from 'transformation-matrix-js'

export default {
    props: {
        desiredPosition: {
            type: Number,
            default: 1.5708
        }, 
        pid: {
            type: Object,
            required: true
        }
    },
    data() {
        return {      
            currentPosition: 0,
            activeBody: null,
            controlBody: null,            
        }
    },
    mounted() {
        this.setupScene()
    },
    methods: {
        setupScene()
        {
            let that = this;
            var Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Composites = Matter.Composites,
            Constraint = Matter.Constraint,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            Composite = Matter.Composite,
            Bodies = Matter.Bodies,
            Body = Matter.Body,
            Events = Matter.Events,
            Vector = Matter.Vector;

            // create engine
            var engine = Engine.create(),
            world = engine.world;

            // create renderer
            var render = Render.create({
            element: this.$refs.scene,
            engine: engine,
            options: {
                width: 800,
                height: 400,
                showAngleIndicator: true,
                showCollisions: true,
                showVelocity: true,
                // showDebug: true
            }
            });


            Render.run(render);

            // create runner
            var runner = Runner.create();
            Runner.run(runner, engine);

            // add bodies
            var group = Body.nextGroup(true);

            // var stack = Composites.stack(250, 255, 1, 1, 0, 0, function(x, y) {
            //     return Bodies.rectangle(x, y, 30, 30);
            // });

            this.controlBody = Bodies.circle(400, 400, 50, {density: 0.005, collisionFilter: { group: group } });
            var anchorPoint = Vector.create(400, 575);


            let leverConstraint = Constraint.create({     
                bodyA: this.controlBody, 
                pointB: anchorPoint,
                
                type: 'pin'
            });

            Composite.add(world, [
            // stack,
            Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true, render: { fillStyle: '#060a19' } }),
            this.controlBody,
            leverConstraint
            ]);



            // add mouse control
            var mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

            Composite.add(world, mouseConstraint);

            // keep the mouse in sync with rendering
            render.mouse = mouse;


            // fit the render viewport to the scene
            Render.lookAt(render, {
                min: { x: 0, y: 0 },
                max: { x: 800, y: 600 }
            });

            // run the renderer
            Render.run(render);


            // create runner
            var runner = Runner.create();

            // run the engine
            Runner.run(runner, engine);

            Events.on(runner, 'tick', () => {  
                  
                this.currentPosition = Vector.angle(this.controlBody.position, anchorPoint);

                let pidForce = this.pid.update(engine.timing.lastDelta, this.currentPosition, this.desiredPosition)
                
                this.applyForce(this.clamp(pidForce, -0.15, 0.15));

                this.$emit('tick', {position: this.currentPosition});
                // Plotly.extendTraces(this.$refs.plot, {
                // y: [[this.leverAngle], [this.desiredAngle]]
                // }, [0, 1], 100)

            });

            Events.on(mouseConstraint, "mousedown", function(event) {
                if (mouseConstraint.body && mouseConstraint.body.label == 'Circle Body') {
                    that.activeBody = mouseConstraint.body;
                }
            });


            Events.on(mouseConstraint, "mouseup", function(event) {
                if (that.activeBody) {
                    that.pid.startProcess((time, timeEntries, pidOptions) => {
                        that.$emit('process-finished', {time: time, timeEntries: timeEntries, pidOptions: pidOptions})
                    });
                }
                that.activeBody = null;
            });
        },
        applyForce(force)
        {
            let forceVector = Matter.Vector.create(0, -force);
            forceVector = Matter.Vector.rotate(forceVector, this.currentPosition);

            Matter.Body.applyForce(this.controlBody, this.controlBody.position, forceVector)
        },
        clamp(num, min, max) {
            return num <= min 
                ? min 
                : num >= max 
                ? max 
                : num
        },
    }
}
</script>
<template>
    <div ref="scene"></div>
</template>