$(function(){

/*	自定义转成整形的方法*/
	jQuery.fn.toInt = function() {
		var s = parseInt(jQuery(this).val().replace( /^0*/,''));
		return isNaN(s) ? 0 : s;
	};

/*	关闭选择区域层*/
	$('.ks-ext-close-x').click(function(){
	    $("#dialog_areas").css('display','none');
	    $("#dialog_batch").css('display','none');
	    $('.ks-ext-mask').css('display','none');
	    return false;
	});

/*	关闭选择区域层*/
	$('.J_Cancel').click(function(){
	    $("#dialog_areas").css('display','none');
	    $("#dialog_batch").css('display','none');
	    $('.ks-ext-mask').css('display','none');
	});	

/*	选择完区域后，确定事件*/
	$('.J_Submit').click(function (){
		var CityText = '', CityText2 = '', CityValue = '';
		//记录已选择的所有省及市的value，SelectArea下标为value值，值为true，如江苏省SelectArea[320000]=true,南京市SelectArea[320100]=true
//		SelectArea = new Array();
		//取得已选的省市的text，返回给父级窗口，如果省份下的市被全选择，只返回显示省的名称，否则显示已选择的市的名称
		//首先找市被全部选择的省份
		$('#J_CityList').find('.gareas').each(function(){
			var a = $(this).find('input[type="checkbox"]').size();
			var b = $(this).find('input:checked').size();
			//市被全选的情况
			if (a == b){
				CityText += ($(this).find('.J_Province').next().html())+',';
			}else{
				//市被部分选中的情况
				$(this).find('.J_City').each(function(){
						//计算并准备传输选择的区域值（具体到市级ID），以，隔开
							if ($(this).attr('checked')){
								CityText2 += ($(this).next().html())+',';
							}
				});
			}
		});
		CityText += CityText2;

		//记录弹出层内所有已被选择的checkbox的值(省、市均记录)，记录到CityValue，SelectArea中
		$('#J_CityList').find('.province-list').find('input[type="checkbox"]').each(function(){
			if ($(this).attr('checked')){
				CityValue += $(this).val()+',';
			}
		});

		//去掉尾部的逗号
		CityText = CityText.replace(/(,*$)/g,'');
		CityValue = CityValue.replace(/(,*$)/g,'');

		//返回选择的文本内容
		if (CityText == '')CityText = '未添加地区';
		$(objCurlArea).find('.area-group>p').html(CityText);
		//返回选择的值到隐藏域
		$('input[name="areas['+curTransType+']['+curIndex.substring(1)+']"]').val(CityValue+'|||'+CityText);
		//关闭弹出层与遮罩层
	    $("#dialog_areas").css('display','none');
	    $('.ks-ext-mask').css('display','none');
	    //清空check_num显示的数量
		$(".check_num").html('');
		$('#J_CityList').find('input[type="checkbox"]').attr('checked',false);
		//如果该配送方式，地区都不为空，隐藏地区的提示层
		isRemove = true;
		$('div[data-delivery="'+curTransType+'"]').find('input[type="hidden"]').each(function(){
			if ($(this).val()==''){
				isRemove = false;return false;
			}
		});
		if (isRemove == true){
			$('div[data-delivery="'+curTransType+'"]').find('span[error_type="area"]').css('display','none');
		}
	});

/*	省份点击事件*/
	$('.J_Province').click(function(){
		if ($(this).attr('checked')){
			//选择所有未被disabled的子地区
			$(this).parent().find('.citys').eq(0).find('input[type="checkbox"]').each(function(){
				if ($(this).attr('disabled')==''){
					$(this).attr('checked',true);
				}else{
					$(this).attr('checked',false);
				}
			});
			//计算并显示所有被选中的子地区数量
			num = '('+$(this).parent().find('.citys').eq(0).find('input:checked').size()+')';
			if (num == '(0)') num = '';
			$(this).parent().parent().find(".check_num").eq(0).html(num);

			//如果该大区域所有省都选中，该区域选中
			input_checked 	= $(this).parent().parent().parent().find('input:checked').size();
			input_all 		= $(this).parent().parent().parent().find('input[type="checkbox"]').size();
			if (input_all == input_checked){
				$(this).parent().parent().parent().parent().find('.J_Group').attr('checked',true);
			}	

		}else{
			//取消全部子地区选择，取消显示数量
			$(this).parent().parent().find(".check_num").eq(0).html('');
			$(this).parent().find('.citys').eq(0).find('input[type="checkbox"]').attr('checked',false);
			//取消大区域选择
			$(this).parent().parent().parent().parent().find('.J_Group').attr('checked',false);
		}
	});

/*	大区域点击事件（华北、华东、华南...）*/
	$('.J_Group').click(function(){
		if ($(this).attr('checked')){
			//区域内所有没有被disabled复选框选中，带disabled说明已经被选择过了，不能再选
			$(this).parent().parent().parent().find('input[type="checkbox"]').each(function(){
				if ($(this).attr('disabled')==''){
					$(this).attr('checked',true);
				}else{
					$(this).attr('checked',false);
				}				
			});
			//循环显示每个省下面的市级的数量
			$(this).parent().parent().parent().find('.province-list').find('.ecity').each(function(){
				//显示该省下面已选择的市的数量
				num = '('+$(this).find('.citys').find('input:checked').size()+')';
				//如果是0，说明没有选择，不显示数量
				if (num != '(0)'){
					$(this).find(".check_num").html(num);
				}
			});
		}else{
			//区域内所有筛选框取消选中
			$(this).parent().parent().parent().find('input[type="checkbox"]').attr('checked',false);
			//循环清空每个省下面显示的市级数量
			$(this).parent().parent().parent().find('.province-list').find('.ecity').each(function(){
				$(this).find(".check_num").html('');
			});
		}

	});

/*	关闭弹出的市级小层*/
	$('.close_button').click(function(){ 
	    $(this).parent().parent().parent().parent().removeClass('showCityPop');
	});

/*	市级地区单事件*/
	$('.J_City').click(function(){
		//显示选择市级数量，在所属省后面
		num = '('+$(this).parent().parent().find('input:checked').size()+')';
		if (num=='(0)')num='';
		$(this).parent().parent().parent().find(".check_num").eq(0).html(num);
		//如果市级地区全部选中，则父级省份也选中，反之有一个不选中,则省份和大区域也不选中
		if (!$(this).attr('checked')){
			//取消省份选择
			$(this).parent().parent().parent().find('.J_Province').attr('checked',false);
			//取消大区域选择
			$(this).parent().parent().parent().parent().parent().parent().find('.J_Group').attr('checked',false);
		}else{
			//如果该省所有市都选中，该省选中
			input_checked 	= $(this).parent().parent().find('input:checked').size();
			input_all 		= $(this).parent().parent().find('input[type="checkbox"]').size();
			if (input_all == input_checked){
				$(this).parent().parent().parent().find('.J_Province').attr('checked',true);
			}
			//如果该大区域所有省都选中，该区域选中
			input_checked 	= $(this).parent().parent().parent().parent().parent().find('input:checked').size();
			input_all 		= $(this).parent().parent().parent().parent().parent().find('input[type="checkbox"]').size();
			if (input_all == input_checked){
				$(this).parent().parent().parent().parent().parent().parent().find('.J_Group').attr('checked',true);
			}
		}
	});
	
/*	省份下拉事件*/
	$(".trigger").click(function () {
		objTrigger = this;objHead = $(this).parent();objPanel = $(this).next();
		if ($(this).next().css('display') == 'none'){
			//隐藏所有已弹出的省份下拉层，只显示当前点击的层
			$('.ks-contentbox').find('.ecity').removeClass('showCityPop');
			$(this).parent().parent().addClass('showCityPop');
		}else{
			//隐藏当前的省份下拉层
			$(this).parent().parent().removeClass('showCityPop');
		}
		//点击省，市所在的head与panel层以外的区域均隐藏当前层
        var oHandle = $(this);
//        oHandle = document.getElementById($(this).attr('id'));//不兼容Ie8,废弃
		var de = document.documentElement?document.documentElement : document.body;
        de.onclick = function(e){
	        var e = e || window.event;
	        var target = e.target || e.srcElement;
	        var getTar = target.getAttribute("id");
	        while(target){
	        	//循环最外层一个时，会出现异常
				try{
					//jquery 转成DOM对象，比较两个DOM对象
	                if(target==$(objHead)[0])return true;
	                if(target==$(objPanel)[0])return true;
	                //暂不考虑使用ID比较
//	                if(target.getAttribute("id")==$(objHead).attr('id'))return true;
//	                if(target.getAttribute("id")==$(objPanel).attr('id'))return true;
				}catch(ex){};
	            target = target.parentNode;
	        }
	        $(objTrigger).parent().parent().removeClass('showCityPop');
        }
	});

	/*	选择运送区域*/
	$('a[entype="J_EditArea"]').live('click',function () {
		curTransType = $(this).next().next().attr('name').substring(6,8);
		//取消所以已选择的checkbox
		$('#J_CityList').find('input[type="checkbox"]').attr('checked',false).attr('disabled','');
	
		//取消显示所有统计数量
		$('#J_CityList').find('.check_num').html('');

		//记录当前行的标识n1,n2,n3....
		curIndex = $(this).parent().parent().attr('data-group');

		//记录当前操作的行，选择完地区会向该区域抛出值
		objCurlArea = $(this).parent();
	
		//记录已选择的所有省及市的value，SelectArea下标为value值，值为true，如江苏省SelectArea[320000]=true,南京市SelectArea[320100]=true
		SelectArea = new Array();

		//取得当前行隐藏域内的city值，放入SelectArea数组中
		var expAreas = $('input[name="areas['+curTransType+']['+curIndex.substring(1)+']"]').val();
		expAreas = expAreas.split('|||');
		expAreas = expAreas[0].split(',');
		try{
			if(expAreas[0] != ''){
				for(var v in expAreas){
					SelectArea[expAreas[v]] = true;
				}
			}
	
			//初始化已选中的checkbox
			$('#J_CityList').find('.ecity').each(function(){
				var count = 0;
				$(this).find('input[type="checkbox"]').each(function(){
					if(SelectArea[$(this).val()]==true){
						$(this).attr('checked',true);
						if($(this)[0].className!='J_Province') count++;
					}
				});
				if (count > 0){
					$(this).find('.check_num').html('('+count+')');
				}
	
			});

			//循环每一行，如果一行省都选中，则大区载选中
			$('#J_CityList>li').each(function(){
				$(this).find('.J_Group').attr('checked',true);
				father = this;
				$(this).find('.J_Province').each(function(){
					if (!$(this).attr('checked')){
						$(father).find('.J_Group').attr('checked',false);
						return ;
					}
				});
			});
		}catch(ex){}
		//其它行已选择的地区，不能再选择了
		$(objCurlArea).parent().parent().find('.area-group').each(function(){
			if ($(this).next().attr('name') != 'areas['+curTransType+']['+curIndex.substring(1)+']'){
				expAreas = $(this).next().val().split('|||');
				expAreas = expAreas[0].split(',');
				//重置SelectArea
				SelectArea = new Array();
				try{
					if(expAreas[0] != ''){
						for(var v in expAreas){
							SelectArea[expAreas[v]] = true;
						}
					}

					//其它行已选中的在这里都置灰
					$('#J_CityList').find('input[type="checkbox"]').each(function(){
						if(SelectArea[$(this).val()]==true){
							$(this).attr('disabled','disabled').attr('checked',false);
						}
					});
					//循环每一行，如果一行的省都被disabled，则大区域也disabled
					$('#J_CityList>li').each(function(){
						$(this).find('.J_Group').attr('disabled','disabled');
						father = this;
						$(this).find('.J_Province').each(function(){
							if (!$(this).attr('disabled')){
								$(father).find('.J_Group').attr('disabled','');
								return ;
							}
						});
					});				
				}catch(ex){}
			}
		});
		//定位弹出层的坐标
		var pos = $(this).position();
		//var pos_x = pos.left-250;
        var pos_x = pos.left+100;
		var pos_y = pos.top+20;
		$("#dialog_areas").css({'left' : pos_x, 'top' : pos_y,'position' : 'absolute','display' : 'block'});
		$('.ks-ext-mask').css('display','block');
	
	});

	$('#title').blur(function(){
		if ($(this).val() !=''){
			$('p[error_type="title"]').css('display','none');
		}
	});
    
});