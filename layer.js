// function updateAnimation(){
// 	var currentSlide = 0;
// 	var id = 400;

// 	var g = $('#'+id);
// 	var anim = g.children('animate, animateTransform, animateColor');
// 	anim.sort(function(a, b){
// 		return (parseInt(b.attr('dur').replace('s', ''))+parseInt(b.attr('begin').replace('s', '')))-(parseInt(a.attr('dur').replace('s', ''))+parseInt(a.attr('begin').replace('s', '')));
// 	});
// 	var initial = g;
	
// 	if(currentSlide = 0){
// 		initial.setAttribute('fill', $('#layer-fg').val());
// 		initial.setAttribute('stroke', $('#layer-bg').val());
// 		initial.setAttribute('width', $('#layer-w').val());
// 		initial.setAttribute('height', $('#layer-h').val());
// 		initial.setAttribute('opacity', $('#layer-opacity').val());
// 		initial.setAttribute('scale', $('#layer-scale').val());
// 		initial.setAttribute('stroke-width', $('#layer-weight').val());
// 		initial.setAttribute('transform', 'translate('+$('#layer-x').val()+' '+$('#layer-y').val()+') rotate('+$('#layer-rotation').val()+')');
// 	}
// }

function createTrack(trackID,fileName){
	var bars = $(".bars");
	var newBarContainer = $('<div class="clearfix track" data-trackid="'+trackID+'"></div>');
	var bar = $('<div><div class="bar"><hr></div><h3 class="layer-name">'+fileName+'</h3></div>');
	newBarContainer.append(bar);
	bars.append(newBarContainer);
}

function editKeyFrame(trackID, pos){
	console.log(trackID);
	console.log(pos);
	console.log(tracks[trackID]);
	var kf = findKeyFrameByPos(tracks[trackID].keyframes, pos);
	console.log(kf);
	if(kf == -1){
		console.error('KeyFrame not found');
		return
	}
	kf.attr = {};
	kf.attr['fill'] = $('#layer-fg').val();
	kf.attr['stroke'] = $('#layer-bg').val();
	kf.attr['width'] = $('#layer-w').val();
	kf.attr['height'] = $('#layer-h').val();
	kf.attr['opacity'] = $('#layer-opacity').val();
	kf.attr['scale'] = $('#layer-scale').val();
	kf.attr['stroke-width'] = $('#layer-weight').val();
	kf.attr['x'] = $('#layer-x').val();
	kf.attr['y'] = $('#layer-y').val();
	kf.attr['rotate'] = $('#layer-rotate').val();
	// kf.attr['transform'] = 'translate('+$('#layer-x').val()+' '+$('#layer-y').val()+') rotate('+$('#layer-rotation').val()+')';
	
	recalculateAnimations(trackID);
}

function createKeyFrame(trackID, pos, el) {
	var newKeyFrame = $('<div class="keyframe selected" data-pos="' + pos + '" style="left:'+pos+'px;"></div>');
	tracks[trackID].keyframes.push(
		{
			"pos": pos, // acts like an id
			"el": newKeyFrame
		}
	);
	el = el || $('[data-trackid="'+trackID+'"] .bar');
	$(el).append(newKeyFrame);	
}

function deleteKeyFrame(trackID, pos) {
	if(pos == 0)
		return
	tracks[trackID].keyframes = tracks[trackID].keyframes.filter(function(el){
		return el.pos != pos;
	});
	$('[data-trackID="'+trackID+'"] .bar').remove();

	recalculateAnimations(trackID);
}


function populateDetails(trackID, pos) {
	var kf = findKeyFrameByPos(tracks[trackID].keyframes, pos);
	if(kf == -1){
		console.error('KeyFrame not found');
		return
	}
	if(kf.hasOwnProperty('attr')){
		$('#layer-fg').val(kf.attr['fill'] || "");
		$('#layer-bg').val(kf.attr['stroke']  || "");
		$('#layer-w').val(kf.attr['width'] || "");
		$('#layer-h').val(kf.attr['height']  || "");
		$('#layer-opacity').val(kf.attr['opacity'] || "");
		$('#layer-scale').val(kf.attr['scale'] || "");
		$('#layer-weight').val(kf.attr['stroke-width'] || "");
		$('#layer-x').val(kf.attr['x'] || "0");
		$('#layer-y').val(kf.attr['y'] || "0");
		$('#layer-rotate').val(kf.attr['rotate'] || "0");
	}
}

function findKeyFrameByPos(ray, pos) {
	for(var i = 0; i < ray.length; ray++){
		if(ray[i].pos == pos) return ray[i]
	}
	return -1;
}


function recalculateAnimations(trackID) {
	console.log('recalc Animations');
	var keyFrames = tracks[trackID].keyframes;
	keyFrames = keyFrames.sort(function(a, b){
		return (parseInt(a.pos) - parseInt(b.pos));
	});
	var el = tracks[trackID].el;
	var totalDuration = $('#project-duration').val();
	var totalWidth = $('#ticket-container').children().length * $('#ticker-container').children().get(0).width;
	var trackWidth = $('.track[data-trackid="'+trackID+'"]').find('.bar').width;
	var trackDuration = (trackWidth/totalWidth) * totalDuration;
	console.log(window.y = el);
	$(el).find('animate, animateTransform, animateColor').remove();


	// variable, previous value, previous time in seconds
	// todo may not be in seconds
	var fields = [['fill', null , -1], ['stroke', null , -1], ['width', null , -1], ['height', null , -1], ['opacity', null , -1], ['stroke-width', null , -1], ['scale', null , -1], ['x', null , -1], ['y', null , -1], ['rotate', null , -1]];
	for(var i = 0; i < keyFrames.length; i++){
		var kf = keyFrames[i];
		var kfa = kf.attr;

		for(var j = 0; j < keyFrames[i].length; j++){
			if(kfa.hasOwnProperty(fields[j][0])){
				if(fields[j][2] != -1){
					// Create animation dawg.
					switch(fields[j][0]) {
					    case "rotate":
					        var anim = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
		        			anim.setAttribute('attributeName', 'transform');
		        			anim.setAttribute('begin', parseInt(fields[j][2])+'s');
		        			anim.setAttribute('dur', parseInt(fields[j][2]-kf[pos])+'s');
		        			anim.setAttribute('type', 'rotate');
		        			anim.setAttribute('from', parseInt(fields[j][1]));
		        			anim.setAttribute('to', kfa["rotate"]);
		        			el.appendChild(anim);
					        break;
					}
				}
				fields[j][1] = kfa[fields[0]];
				fields[j][2] = kf[pos];
			}
		}
	}
}

// kf.setAttribute('fill', $('#layer-fg').val());
// kf.setAttribute('stroke', $('#layer-bg').val());
// kf.setAttribute('width', $('#layer-w').val());
// kf.setAttribute('height', $('#layer-h').val());
// kf.setAttribute('opacity', $('#layer-opacity').val());
// kf.setAttribute('scale', $('#layer-scale').val());
// kf.setAttribute('stroke-width', $('#layer-weight').val());
// kf.setAttribute('transform', 'translate('+$('#layer-x').val()+' '+$('#layer-y').val()+') rotate('+$('#layer-rotation').val()+')');