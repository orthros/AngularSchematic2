

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Directive, HostBinding, HostListener, Inject } from '@angular/core';
import { Http } from '@angular/http';
//import { SchematicConfigurationService } from '../../core/Services/schematicConfiguration.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

//import { LoadedRouterConfig } from '@angular/router/src/router_config_loader';
import { ISchematicConfiguration } from '../../models/schematicConfiguration';
import { ISchematicConfigurationConnections } from '../../models/schematicConfigurationConnections';
import { ISchematicPipeNodes } from '../../models/schematicPipeNodes'

import { max } from 'rxjs/operator/max';

@Component({
    selector: 'schematicCanvas',
    templateUrl: './schematicCanvas.component.html'
})

//export class SchematicObject {
//    name: string;
//    x: number;
//    y: number;
//    scale: number;
//    type: number;
//    connections: SchematicObject[];

//}
export class SchematicCanvasComponent implements OnInit{
    indLoading: boolean = false;
    indConnectionsLoading: boolean = false;
    indPipeNodesLoading: boolean = false;
    @ViewChild('canvas') canvasRef: ElementRef;
    configObjects: ISchematicConfiguration[];
    configObjectConnections: ISchematicConfigurationConnections[];
    configPipeNodes: ISchematicPipeNodes[];
    //sco: SchematicObject[];
    msg: string;
    scale: number;
    xOffset: number;
    yOffset: number;
    isInitialScaleSetup: boolean;
    lastMouseX: number;
    lastMouseY: number;
    lastMouseEvent : any;
    objectsPopulated: boolean = false;
    objConnections: number[][];

    objPipeNodes: number[][];


    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
    }

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: any) {
        let keyPressed: string = event.key;
        if (keyPressed == "a") {
            this.scale = this.scale * 1.1;
            this.RenderSchematic();
        }
        if (keyPressed == "s") {
            this.scale = this.scale / 1.1;
            this.RenderSchematic();
        }
    }

    private mouseDown: boolean = false;

    @HostListener('mouseup')
    onMouseup() {
        this.mouseDown = false;
        
    }

    @HostListener('mousemove', ['$event'])
    onMousemove(event:any) {
        if (this.mouseDown) {
            let deltaX = event.clientX - this.lastMouseX;
            let deltaY = event.clientY - this.lastMouseY;
            this.xOffset += deltaX / this.scale;
            this.yOffset += deltaY / this.scale;
            this.RenderSchematic();
           
            
        }
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
        this.lastMouseEvent = event;
    }

    @HostListener('mousewheel', ['$event'])
    onMousewheel(event:any) {
        let mouseWheelDelta: number = event.wheelDelta;

        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
        this.lastMouseEvent = event;

        let scaleMultiplier: number = (mouseWheelDelta / 1000) + 1;
        this.ReScalingSchematicUI(scaleMultiplier, event.clientX, event.clientY);
    }

    @HostListener('mousedown', ['$event'])
    onMousedown(event:any) {
        this.mouseDown = true;
        this.lastMouseEvent = event;
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
    }
  
    
    ngOnInit(): void {
        
        this.LoadSchematicConfig();
    }
    PopulateObjects(): void {
        //for (let i = 0; i < this.configObjects.length; i++) {
        //    let co = this.configObjects[i];
        //    let newObject = new SchematicObject();
        //    newObject.name = co.name;
        //    newObject.x = co.x;
        //    newObject.type = co.type;
        //    newObject.scale = co.scale;
        //    this.sco[i] = newObject;


        //}
        this.objConnections = [];
        this.objPipeNodes = [];
        for (let i = 0; i < this.configObjects.length; i++) {
           
            this.objConnections[i] = [];
            this.objPipeNodes[i] = [];
        }
        
        for (let i = 0; i < this.configObjectConnections.length; i++) {
            
            let coo = this.configObjectConnections[i];
            let leftObject = this.configObjects[coo.leftObjectFk - 1];
            let rightObject = this.configObjects[coo.rightObjectFk - 1];

          
            this.objConnections[coo.leftObjectFk - 1][this.objConnections[coo.leftObjectFk - 1].length] = coo.rightObjectFk - 1;
            
        }
        
        for (let i = 0; i < this.configPipeNodes.length; i++) {
            let cpn = this.configPipeNodes[i];
            this.objPipeNodes[cpn.pipeFk - 1][this.objPipeNodes[cpn.pipeFk - 1].length] = i;
        }

        for (let i = 0; i < this.configObjects.length; i++) {
            if (this.objConnections[i].length == 2) {
                if ((this.configObjects[i].leftAssetFk - 1) == this.objConnections[i][1]) {
                    //we need to flip the connections around
                    let swap: number = this.objConnections[i][0];
                    this.objConnections[i][0] = this.objConnections[i][1];
                    this.objConnections[i][1] = swap;
                }
            }
        }
        this.objectsPopulated = true;
    }

    LoadSchematicConfig(): void {
        this.indLoading = true;
        this.indConnectionsLoading = true;
        this.indPipeNodesLoading = true;
        console.log("Loading config objects");

        this.http.get(this.baseUrl + 'api/schematicConfiguration/ConfigObjects').subscribe(result => {
            this.configObjects = result.json() as ISchematicConfiguration[];
            this.indLoading = false;
            console.log("loaded " + this.configObjects.length);
            this.RenderSchematic();
        }, error => console.error(error));
        let testObject: ISchematicConfiguration;

        console.log("Loading config object connections");
        this.http.get(this.baseUrl + 'api/schematicConfiguration/ConfigObjectConnections').subscribe(result => {
            var resultObject = result.json();
            
            this.configObjectConnections = result.json() as ISchematicConfigurationConnections[];
            this.indConnectionsLoading = false;
            console.log("loaded " + this.configObjectConnections.length + " connections");
            this.RenderSchematic();
        }, error => console.error(error));

        console.log("Loading config pipe nodes");
        this.http.get(this.baseUrl + 'api/schematicConfiguration/ConfigPipeNodes').subscribe(result => {
            this.configPipeNodes = result.json() as ISchematicPipeNodes[];
            this.indPipeNodesLoading = false;
            console.log("loaded " + this.configPipeNodes.length + " pipe nodes");
            this.RenderSchematic();
        }, error => console.error(error));
       
    }
    ReScalingSchematicUI(scaleMultiplier: number, currentPointX: number, currentPointY: number) {
        if (scaleMultiplier == 1) return;
        let originalPointX = this.getRealX(currentPointX);
        let originalPointY = this.getRealY(currentPointY);


        let newScale = this.scale * scaleMultiplier;



        this.scale = newScale;

        let newRealPointX = this.getRealX(currentPointX);
        let newRealPointY = this.getRealY(currentPointY);

        this.xOffset = this.xOffset + (newRealPointX - originalPointX);
        this.yOffset = this.yOffset + (newRealPointY - originalPointY);

        this.RenderSchematic();
    }

    SetupInitialScale() {
        let ctx: CanvasRenderingContext2D =
            this.canvasRef.nativeElement.getContext('2d');

        let canvasWidth: number = this.canvasRef.nativeElement.width;
        let canvasHeight: number = this.canvasRef.nativeElement.height;

        let minX: number = 9999999;
        let maxX: number = -9999999;
        let minY: number = 9999999;
        let maxY: number = -9999999;


        for (let i = 0; i < this.configObjects.length; i++) {
            let co = this.configObjects[i];
            if (co.x < minX) minX = co.x;
            if (co.x > maxX) maxX = co.x;
            if (co.y < minY) minY = co.y;
            if (co.y > maxY) maxY = co.y;

        }
        console.log("x min max " + minX + " " + maxX + " y min max " + minY + " " + maxY);

        let xScale: number = canvasWidth / (maxX - minX);
        let yScale: number = canvasHeight / (maxY - minY);

        this.scale = xScale;
        if (yScale < xScale) this.scale = yScale;

        let centerX: number = (maxX + minX) / 2;
        let centerY: number = (maxY + minY) / 2;

        this.xOffset = canvasWidth / (2 * this.scale) - centerX;
        this.yOffset = canvasHeight / (2 * this.scale) - centerY;
        this.isInitialScaleSetup = true;
        console.log("schematic initial scale is " + this.scale + " xoffset " + this.xOffset + " yoffset " + this.yOffset);
    }

    getScreenX(x: number):number {
        return (x + this.xOffset) * this.scale;
    }
    getScreenY(y: number): number {
        return (y + this.yOffset) * this.scale;
    }

    getRealX(x: number): number {
        return (x / this.scale) - this.xOffset;
    }

    getRealY(y: number): number {
        return (y / this.scale) - this.yOffset;
    }
   
    RenderSchematic() {
        if ((this.indConnectionsLoading) || (this.indLoading) || (this.indPipeNodesLoading)) return true;
        if (!this.objectsPopulated) this.PopulateObjects();
        if (!this.isInitialScaleSetup) {
            this.SetupInitialScale();
        }
        let ctx: CanvasRenderingContext2D =
            this.canvasRef.nativeElement.getContext('2d');

        let canvasWidth: number = this.canvasRef.nativeElement.width;
        let canvasHeight: number = this.canvasRef.nativeElement.height;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.font = 'italic 400 12px/2 Unknown Font, sans-serif';
        //ctx.fillStyle = '#DD0031';
        ctx.strokeStyle = '#000000';
        for (let i = 0; i < this.configObjectConnections.length; i++) {
            let drawLine: boolean = true;
            let con = this.configObjectConnections[i];
            let leftX = this.getScreenX(this.configObjects[con.leftObjectFk-1].x);
            let leftY = this.getScreenY(this.configObjects[con.leftObjectFk-1].y);
            let rightX = this.getScreenX(this.configObjects[con.rightObjectFk-1].x);
            let rightY = this.getScreenY(this.configObjects[con.rightObjectFk - 1].y);
            if (this.configObjects[con.leftObjectFk - 1].type == 1) {
                drawLine = false;

            }
            if (this.configObjects[con.rightObjectFk - 1].type == 1) {
                drawLine = false;

            }
            if (drawLine) {
                ctx.beginPath();
                ctx.moveTo(leftX, leftY);
                ctx.lineTo(rightX, rightY);
                ctx.stroke();
                ctx.closePath();
            }
        }
        let pipesDebugged = 0;
        for (let i = 0; i < this.configObjects.length; i++) {
            
            let co = this.configObjects[i];
            let coX: number = this.getScreenX(co.x);
            let coY: number = this.getScreenY(co.y);
            if (co.type == 4) {
                ctx.strokeStyle = '#000000';

                let tankColor = Math.round(co.x + co.y) % 3;
                if (tankColor < 0) tankColor = - tankColor;
                if (tankColor == 0) {

                    ctx.fillStyle = '#DD0020';
                }
                if (tankColor == 1) {

                    ctx.fillStyle = '#00DD20';
                }
                if (tankColor == 2) {

                    ctx.fillStyle = '#2000DD';

                }

                let radius: number = 0.8 * co.scale * this.scale;
                let tankLevel: number = (co.x % 10) / 10;
                if (tankLevel < 0) tankLevel = -tankLevel;
                let fluidRadius = tankLevel * radius;
                ctx.beginPath();
                ctx.arc(coX, coY, fluidRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(coX, coY);
                ctx.arc(coX, coY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();

                if (radius > 20) {
                    ctx.beginPath();
                    let textWidth: number = ctx.measureText(co.name).width;
                    ctx.fillStyle = '#FFFFFF';
                    ctx.rect((coX - (textWidth / 2)) - 1, coY - 12, textWidth + 2, 14);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                    ctx.strokeText(co.name, coX - (textWidth / 2), coY);

                }
            } else if (co.type == 1) {
                if (this.objConnections[i].length > 1) {
                    let pipexs: number[] = [];
                    let pipeys: number[] = [];
                    pipexs[0] = this.getScreenX(this.configObjects[this.objConnections[i][0]].x);
                    pipeys[0] = this.getScreenY(this.configObjects[this.objConnections[i][0]].y);
                    pipexs[pipexs.length] = coX;
                    pipeys[pipeys.length] = coY;
                    if (this.objPipeNodes[i].length > 0) {
                        if (pipesDebugged < 10) {
                            console.log("drawing nodes for object " + co.name + " nNodes is " + this.objPipeNodes[i].length);
                        }
                    }
                    for (let j = 0; j < this.objPipeNodes[i].length; j++) {
                        if (pipesDebugged < 10) {
                            console.log("pipe node index is " + this.objPipeNodes[i][j]);
                        }
                        pipexs[pipexs.length] = this.getScreenX(this.configPipeNodes[this.objPipeNodes[i][j]].x);
                        pipeys[pipeys.length] = this.getScreenY(this.configPipeNodes[this.objPipeNodes[i][j]].y);
                        if (pipesDebugged < 10) {
                            console.log("x " + pipexs[pipexs.length - 1] + " y " + pipeys[pipeys.length - 1]);
                        }
                        pipesDebugged++;
                    }
                    pipexs[pipexs.length] = this.getScreenX(this.configObjects[this.objConnections[i][1]].x);
                    pipeys[pipeys.length] = this.getScreenY(this.configObjects[this.objConnections[i][1]].y);
                    ctx.beginPath();
                    ctx.moveTo(pipexs[0], pipeys[0]);
                    for (let k = 1; k < pipexs.length; k++) {
                        ctx.lineTo(pipexs[k], pipeys[k]);
                    }
                    ctx.save();
                    let pipeColor = Math.round(co.x + co.y) % 3;
                    if (pipeColor < 0) pipeColor = - pipeColor;
                    if (pipeColor == 0) {

                        ctx.strokeStyle = '#0DD002050';
                    }
                    if (pipeColor == 1) {

                        ctx.strokeStyle = '#00DD2050';
                    }
                    if (pipeColor == 2) {

                        ctx.strokeStyle = '#2000DD50';

                    }
                    
                    ctx.lineWidth = 0.025 * this.scale;
                    ctx.stroke();
                    ctx.closePath();
                    ctx.restore();
                }

            } else {
                if (this.scale > 100) {
                    ctx.beginPath();
                    let textWidth: number = ctx.measureText(co.name).width;
                    ctx.fillStyle = '#FFFFFF';
                    ctx.rect((coX - (textWidth / 2)) - 1, coY - 12, textWidth + 2, 14);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                    ctx.strokeText(co.name, coX - (textWidth / 2), coY);
                }
            }
        }
        

        //// Draw 50,000 circles at random points
        //ctx.beginPath();
        //ctx.fillStyle = '#DD0031';
        //for (let i = 0; i < 50000; i++) {
        //    let x = Math.random() * 500;
        //    let y = Math.random() * 500;
        //    ctx.moveTo(x, y);
        //    ctx.arc(x, y, 1, 0, Math.PI * 2);
        //}
        //ctx.fill();
    }
}
