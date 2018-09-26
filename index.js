#!/usr/bin/env node
const args = require('yargs')
	.usage('Usage: genssce --input FILEPATH')
	.option('input', {
		alias: 'i',
		desc: 'atlas file(.json, .txt) path',
		demand: true,
	})
	.option('ouput', {
		alias: 'o',
		desc: 'output ssce file path',
		demand: false,
	})
	.option('verbose', {
		alias: 'v',
		default: false
	})
	.argv;
const fs = require('fs');
const mustache = require('mustache');
const path = require('path');
const template = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<SpriteStudioCellMap version="1.00.02">
    <name>{{atlasName}}</name>
    <exportPath></exportPath>
    <generator>SpriteStudio</generator>
    <packed>0</packed>
    <imagePath>{{atlasTextureName}}.png</imagePath>
    <pixelSize>{{sizeInfo.w}} {{sizeInfo.h}}</pixelSize>
    <overrideTexSettings>0</overrideTexSettings>
    <wrapMode>clamp</wrapMode>
    <filterMode>linear</filterMode>
    <imagePathAtImport></imagePathAtImport>
    <packInfoFilePath></packInfoFilePath>
    <texPackSettings>
        <maxSize>4096 4096</maxSize>
        <forcePo2>1</forcePo2>
        <forceSquare>0</forceSquare>
        <margin>0</margin>
        <padding>1</padding>
    </texPackSettings>
    <cells>
    {{#cells}}
        <cell>
            <name>{{name}}</name>
            <pos>{{x}} {{y}}</pos>
            <size>{{w}} {{h}}</size>
            <pivot>0 0</pivot>
            <rotated>0</rotated>
            <orgImageName></orgImageName>
            <posStable>0</posStable>
        </cell>
    {{/cells}}
    </cells>
</SpriteStudioCellMap>`;
	try{
		if(args.verbose){
			console.log(args);
		}
		const filePath = args.input;
		console.log("load from " + filePath);

		const atlasName = path.basename(filePath).split('.').slice(0, -1).join('.');
		const outputPath = args.output && 0<args.output.length
			 ? args.output
			 : path.dirname(filePath) + "/" + atlasName + ".ssce";
		console.log("export to " + outputPath);

		const content = fs.readFileSync(filePath, 'utf8');
		const obj = JSON.parse(content);
		const frames = obj.frames;
		const sizeInfo = obj.meta.size;
		const atlasTextureName = obj.meta.image ? obj.meta.image : atlasName;
		const cells = [];
		Object.keys(frames).forEach(function (key) {
			const entry = frames[key];
			const frame = entry.frame;
			cells.push({
				name:key.split('.').slice(0, -1).join('.'),
				x:frame.x,
				y:frame.y,
				w:frame.w,
				h:frame.h,
			});
		});

		exportInfo = {
			atlasName:atlasName,
			atlasTextureName:atlasTextureName,
			sizeInfo:sizeInfo,
			cells:cells,
		};

		if(args.verbose){
			console.log(exportInfo);
		}
		const ssceBody = mustache.render(template, exportInfo);
		if(args.verbose){
			console.log(ssceBody);
		}
		fs.writeFileSync(outputPath, ssceBody);
		console.log("finish");
	}
	catch(err)
	{
		console.error(err);
	}
