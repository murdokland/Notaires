/*  var geocoder;
  var map = null;
  function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
      zoom: 12,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	googlemaps();
	
	
  }
  function lafonction(){
	  $( "#popupMap" ).popup( "open" );
	  
  }
  function googlemaps(){	  
	  var address = window.localStorage.getItem("url");
	  geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'address': address }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		map.setCenter(results[0].geometry.location);
		var marker = new google.maps.Marker({
		map: map,
		position: results[0].geometry.location
  });
		google.maps.event.trigger(map, 'resize');
		
		
	  } else {
		//alert("Pas de localisation");
	  }
	});  
  }*/


function espace_tel(letel) {
	letel= letel.replace(/\./g,"");
	letel= letel.replace(/ /g,"");
	return letel;
}
function test_zone(adresse){
	var resultat = adresse.indexOf('BP');
	if (resultat >= 0){
		var test1 = true;
		//alert (adresse+"test1="+test1);
	};
	resultat = adresse.indexOf('PAE');
	if (resultat >= 0){
		var test2 = true;
		//alert (adresse+"test2="+test2);
	};
	resultat = adresse.indexOf('ZA');
	if (resultat >= 0){
		var test3 = true;
		//alert ("adresse+test3="+test3);
	};
	resultat = adresse.indexOf('ZAC');
	if (resultat >= 0){
		var test4 = true;
	};
	resultat = adresse.indexOf('ZI');
	if (resultat >= 0){
		var test5 = true;
	};
	resultat = adresse.indexOf('ZAE');
	if (resultat >= 0){
		var test6 = true;
	};
	if (test1 || test2 || test3 || test4 || test5 || test6 == true){
		return true;	
	} else {
		return false;	
	};
}

function google_maps(adresse,codepostal,ville){
	adresse_final = "";
	if (adresse.length >0){
		console.log("adresse pas nul");
		adresse= adresse.replace(/''/g,"+");
		adresse = adresse.replace(/ /g,"+");
		if (test_zone(adresse) == false){
			adresse_final += adresse ;
		};
		
	}
	
	adresse_final += "+"+codepostal ;

	if (ville.length >0){
		ville = ville.replace(/ /g,"+");
		ville = ville.replace(/CEDEX/g,"");
		adresse_final += "+"+ville+"" ;
	}	
	return adresse_final; 
	 
}
function listing(id) {
		var output = $('#'+id);
		output.append('Chargement');
		$.ajax({
			url: 'http://notaires-appli.com/notaires74-73/php/listing.php?id='+id,
			<!--url: 'http://localhost/notaires/notaires74/php/listing.php?id=d73',-->
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			timeout: 5000,
			success: function(data, status){
				output.empty();
				$.each(data, function(i,item){
					var donnee = '<li data-theme="c"><a href="#page5" id="'+item.ville+'" data-transition="slide">'+item.ville+'</a></li>';
					output.append(donnee);
					output.listview("refresh");
				});
			},
			error: function(request, error){
				output.text('Problème avec les données.');
				output.text(request.responseText);
			}
		});
}
function listingVille(ville) {
		var output = $('#output_listing_ville');
		output.append('Chargement');
		$.ajax({
			url: 'http://notaires-appli.com/notaires74-73/php/listing_ville.php?ville='+ville,
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			timeout: 5000,
			success: function(data, status){
				output.empty();
				$.each(data, function(i,item){
					var donnee = '<li data-theme="c"><a href="#page6" id="'+item.id+'" data-transition="slide">'+item.nom+' '+item.prenom+'</a></li>';
					output.append(donnee);
					output.listview("refresh");
				});
			},
			error: function(request, error){
				output.text('Problème avec les données.');
				output.text(request.responseText);
			}
		});
}
function fiche(id) {
		var output = $('#fiche');
		output.append('Chargement');
		$.ajax({
			url: 'http://notaires-appli.com/notaires74-73/php/fiche.php?id='+id,
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			timeout: 5000,
			success: function(data, status){
				output.empty();
				$.each(data, function(i,item){
					var donnee = '<h1>'+item.nom+' '+item.prenom+'</h1>'
					+ '<h2>SCP '+item.nom_crpcen+'</h2>'
					+ '<p>'
					if (item.adresse.length > 0){donnee += item.adresse+' <br>'}
					if (item.bp.length > 0){donnee += item.bp+'<br>'}
					if (item.cp.length > 0){donnee += '<strong style="color:#000000">'+item.cp+'</strong> '}
					if (item.ville.length > 0){donnee += item.ville+' '}
					if (item.cedex.length > 0){donnee += item.cedex}
					donnee += '<br><br>'
					
					var superadresse = google_maps(item.adresse,item.cp_reel,item.ville);
					window.localStorage.setItem("url", superadresse);
					/*if (item.adresse.length > 0){donnee += '<li><a href="'+google_maps(item.adresse,item.cp_reel,item.ville)+'" data-role="button" rel="external" target="_blank" >Localiser</a></li>'}*/
     				/*if (item.adresse.length > 0){donnee += '<li><a href="#" data-rel="popup" data-position-to="window" data-role="button" data-theme="b" data-ajax= "false" data-inline="true" onClick="lafonction()">Localiser</a></li>'}*/
					if (item.adresse.length > 0){donnee += '<ul data-role="listview" id="fiche2"><li><a href="#lamap" rel="external" data-role="button" data-theme="b" data-inline="true" data-transition="slide" >Localiser</a></li>'}
					if (item.tel.length > 0){donnee += '<li><a href="tel:'+espace_tel(item.tel)+'" data-icon="ui-icon-myapp-tel"><img src="images/tel.png" alt="Télephone" class="ui-li-icon">'+espace_tel(item.tel)+'</a></li>'}
					if (item.fax.length > 0){donnee += '<li><img src="images/fax.png" alt="Télephone" class="ui-li-icon">' +espace_tel(item.fax)+'</li>'}
					if (item.email1.length > 0){donnee += '<li><a href="mailto:'+item.email1+'"><img src="images/email.png" alt="Télephone" class="ui-li-icon">' +item.email1+'</a></li></p>'}
					if (item.email2.length > 0){donnee += '<li><a href="mailto:'+item.email2+'"><img src="images/email.png" alt="Télephone" class="ui-li-icon">' +item.email2+'</a></li></p>'}
					donnee += "</u>";
					
					output.append(donnee);
					output.listview("refresh");
					$('#fiche2').listview();
					
				});
			},
			error: function(request, error){
				output.text('Problème avec les données.');
				output.text(request.responseText);
				
			}
		});
}
function convertdate(strDate){
	strDate = strDate.split("-");
	myJSDate = (strDate[2]+"/"+strDate[1]);
	return myJSDate;
}
function tcheckdate(date_debut_agenda,date_fin_agenda){
	date_debut_agenda = convertdate(date_debut_agenda);
	date_fin_agenda = convertdate(date_fin_agenda);
	if (date_debut_agenda == date_fin_agenda ){
		ladate = date_debut_agenda;
	} else {
		ladate = date_debut_agenda+" au "+date_fin_agenda;
	}
	return ladate;
}
function actualite() {
	var output = $('#output_listing_agenda');
	output.append('Chargement');
	$.ajax({
		url: 'http://notaires-appli.com/notaires74-73/php/agenda.php',
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		timeout: 5000,
		success: function(data, status){
			output.empty();
			$.each(data, function(i,item){
				var donnee = '<u>'+tcheckdate(item.date_debut_agenda,item.date_fin_agenda)+'</u><br><strong>'+item.lieu_agenda+'</strong> - '+item.texte
					if (item.heure_agenda.length > 0){donnee += " - "+item.heure_agenda}
				    donnee += '<br><br>';
				output.append(donnee);
				output.listview("refresh");
			});
		},
		error: function(request, error){
			output.text('Problème avec les données.');
			output.text(request.responseText);
		}
	});
}




function actualite_accueil() {
	var output = $('#news');
	output.append('Chargement');
	$.ajax({
		url: 'http://notaires-appli.com/notaires74-73/php/agenda.php?limit=2',
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		timeout: 5000,
		success: function(data, status){
			output.empty();
			$.each(data, function(i,item){
				var donnee = '<li><strong>'+tcheckdate(item.date_debut_agenda,item.date_fin_agenda)+' - '+item.lieu_agenda+' - '+item.texte+'</strong>&nbsp;&nbsp;<a href="mailto:?subject=Actualité Notaires&body='+convertdate(item.date_debut_agenda)+' au '+convertdate(item.date_fin_agenda)+' - '+item.lieu_agenda+' - '+item.texte+'"><img src="images/email.png" alt="Télephone" class="ui-li-icon"></a></li><br>';
				output.append(donnee);
			});
		},
		error: function(request, error){
			output.text('Problème avec les données.');
			output.text(request.responseText);
		}
	});
}
function verifchamp(montant){
	if (($('#checkbox-1a').attr('checked'))||($('#checkbox-2a').attr('checked'))){
		var test1 = true;
	}
	if (montant !=''){
		var test2 = true;
	};

	if (test1  == true && test2 == true){
		return true;	
	} else {
		return false;	
	};

}
function calcul(){
    var choix = $("input[type=radio]:checked").attr("value");
    var montant = $("input[name=montant]").attr("value");
	var output = $('#resultat_calcul');
	output.empty();
	if (verifchamp(montant)==false){
       alert("Tous les champs requis n'ont pas été spécifiés")
    }
    else{
		var honoraire;
		var mutation;
		var publicitefonciere;
		
		if (montant <= 6500 ){
			honoraire = 4;
			honoraire_ajout = 0;
		}
		if (montant >= 6501 && montant <= 17000 ){
			honoraire = 1.65;
			honoraire_ajout = 152.75 ;
		}
		if (montant >= 17001 && montant <= 60000 ){
			honoraire = 1.10;
			honoraire_ajout = 246.25;
		}
		if (montant >= 60001 ){
			honoraire = 0.825;
			honoraire_ajout = 411.25;
		}
			//console.log("% honoraire: "+honoraire); 
		honoraire = (((montant*honoraire)/100)+ honoraire_ajout)*1.196; <!--La rémunération du notaire -->
			//console.log("honoraire: "+honoraire+"€");
			
		if (choix == "ancien") {
			mutation = ((montant*5.09)/100); <!--droit de mutation si ancien-->
			//console.log("mutation: "+mutation);
			publicitefonciere = 0;	
			//console.log("pas de publicité fonciere");
		}	else {
			publicitefonciere = ((montant*0.715)/100); <!--si neuf-->
			//console.log("publicite fonciere: "+publicitefonciere);
			mutation = 0;	
			//console.log("pas mutation");
		}
		console.log(publicitefonciere+" "+mutation);
		hypotheque = (montant*0.10)/100;
		hypotheque =  Math.round(hypotheque * 100) / 100;
		honoraire =  Math.round(honoraire * 100) / 100;
		mutation =  Math.round(mutation * 100) / 100;
		publicitefonciere =  Math.round(publicitefonciere * 100) / 100;
		total = honoraire+mutation+hypotheque+publicitefonciere + 1000;
		total =  Math.round(total * 100) / 100;
			//console.log("total: "+total+"€\n\r\n");
		if (choix == "ancien") {
			output.append('<p>Les droits de mutation: '+mutation+"€</p>\n" );
		};
		output.append('<p>Les émoluments de formalités et frais divers : 1000€</p>\n' );
		output.append('<p>La rémunération du notaire: '+honoraire+"€ TTC</p>\n" );
		if (choix == "neuf"){
			output.append('<p>Publicité foncière: '+publicitefonciere+"€</p>\n" );
		}
		//output.append('<p>Le salaire du conservateur des hypothèques: '+hypotheque+"€</p>\n" );
		output.append('Résultat: '+total+"€\n");
		output.append("<p style='color:#000'>Ses calculs sont purement informatifs et le mieux est de vous rapprocher du Notaires des Savoie le plus proche de chez vous. </p><a href='#page2' data-role='button' id='home' data-inline='true'  >ANNUAIRE</a><br>");
		$('#resultat_calcul a[data-role=button]').button();
    }
 
}


/*function recherche(){
	var nom = $("input[name=nom]").attr("value");
	var ville = $("input[name=ville]").attr("value");
	var output = $('#output_listing_recherche');	
	
	if(nom == '') {
            alert('Le champ est vide');
        } else {
		output.append('Chargement');
		
		$.ajax({
			url: 'http://localhost/notaires/notaires74/php/recherche.php?nom='+nom+'',
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			timeout: 5000,
			success: function(data, status){
				output.empty();
				$.each(data, function(i,item){
					var donnee = '<li data-theme="c"><a href="#page6" id="'+item.id+'" data-transition="slide">'+item.nom+' '+item.prenom+'</a></li>';
					output.append(donnee);
					output.listview("refresh");
				});
			},
			error: function(request, error){
				output.text('Problème avec les données.');
				output.text(request.responseText);
			}
		});
	}
    

}*/

/////////////////////////////////////////////////////////////////////////////////////


$('#page3').live('pageinit', function (event, ui) { 
		listing("d73");
});
$('#page4').live('pageinit', function (event, ui) { 
		listing("d74");
});
$('#page7').live('pageinit', function (event, ui) { 
		actualite();
});
$('#d73 a').live('click', function (event) { 
		var ville = $(event.currentTarget).attr('id');
		listingVille(ville);
});
$('#d74 a').live('click', function (event) { 
		var ville = $(event.currentTarget).attr('id');
		listingVille(ville);
});

$('#output_listing_ville a').live('click', function (event) { 
		var id = $(event.currentTarget).attr('id');
		window.localStorage.setItem("id", id);
		fiche(id);
});

$('#output_listing_recherche a').live('click', function (event) { 
		var id = $(event.currentTarget).attr('id');
		fiche(id);
});




////////////////////////////////////////////////////////////////////////////////////
//////                             ACTU                                 ////////////

/* =========================================================

// jquery.innerfade.js

// Datum: 2008-02-14
// Firma: Medienfreunde Hofmann & Baldes GbR
// Author: Torsten Baldes
// Mail: t.baldes@medienfreunde.com
// Web: http://medienfreunde.com

// based on the work of Matt Oakes http://portfolio.gizone.co.uk/applications/slideshow/
// and Ralf S. Engelschall http://trainofthoughts.org/

 *
 *  <ul id="news"> 
 *      <li>content 1</li>
 *      <li>content 2</li>
 *      <li>content 3</li>
 *  </ul>
 *  
 *  $('#news').innerfade({ 
 *	  animationtype: Type of animation 'fade' or 'slide' (Default: 'fade'), 
 *	  speed: Fading-/Sliding-Speed in milliseconds or keywords (slow, normal or fast) (Default: 'normal'), 
 *	  timeout: Time between the fades in milliseconds (Default: '2000'), 
 *	  type: Type of slideshow: 'sequence', 'random' or 'random_start' (Default: 'sequence'), 
 * 		containerheight: Height of the containing element in any css-height-value (Default: 'auto'),
 *	  runningclass: CSS-Class which the container get’s applied (Default: 'innerfade'),
 *	  children: optional children selector (Default: null)
 *  }); 
 *

// ========================================================= */


(function($) {

    $.fn.innerfade = function(options) {
        return this.each(function() {   
            $.innerfade(this, options);
        });
    };

    $.innerfade = function(container, options) {
        var settings = {
        		'animationtype':    'fade',
            'speed':            'normal',
            'type':             'sequence',
            'timeout':          2000,
            'containerheight':  'auto',
            'runningclass':     'innerfade',
            'children':         null
        };
        if (options)
            $.extend(settings, options);
        if (settings.children === null)
            var elements = $(container).children();
        else
            var elements = $(container).children(settings.children);
        if (elements.length > 1) {
            $(container).css('position', 'relative').css('height', settings.containerheight).addClass(settings.runningclass);
            for (var i = 0; i < elements.length; i++) {
                $(elements[i]).css('z-index', String(elements.length-i)).css('position', 'absolute').hide();
            };
            if (settings.type == "sequence") {
                setTimeout(function() {
                    $.innerfade.next(elements, settings, 1, 0);
                }, settings.timeout);
                $(elements[0]).show();
            } else if (settings.type == "random") {
            		var last = Math.floor ( Math.random () * ( elements.length ) );
                setTimeout(function() {
                    do { 
												current = Math.floor ( Math.random ( ) * ( elements.length ) );
										} while (last == current );             
										$.innerfade.next(elements, settings, current, last);
                }, settings.timeout);
                $(elements[last]).show();
						} else if ( settings.type == 'random_start' ) {
								settings.type = 'sequence';
								var current = Math.floor ( Math.random () * ( elements.length ) );
								setTimeout(function(){
									$.innerfade.next(elements, settings, (current + 1) %  elements.length, current);
								}, settings.timeout);
								$(elements[current]).show();
						}	else {
							alert('Innerfade-Type must either be \'sequence\', \'random\' or \'random_start\'');
						}
				}
    };

    $.innerfade.next = function(elements, settings, current, last) {
        if (settings.animationtype == 'slide') {
            $(elements[last]).slideUp(settings.speed);
            $(elements[current]).slideDown(settings.speed);
        } else if (settings.animationtype == 'fade') {
            $(elements[last]).fadeOut(settings.speed);
            $(elements[current]).fadeIn(settings.speed, function() {
							removeFilter($(this)[0]);
						});
        } else
            alert('Innerfade-animationtype must either be \'slide\' or \'fade\'');
        if (settings.type == "sequence") {
            if ((current + 1) < elements.length) {
                current = current + 1;
                last = current - 1;
            } else {
                current = 0;
                last = elements.length - 1;
            }
        } else if (settings.type == "random") {
            last = current;
            while (current == last)
                current = Math.floor(Math.random() * elements.length);
        } else
            alert('Innerfade-Type must either be \'sequence\', \'random\' or \'random_start\'');
        setTimeout((function() {
            $.innerfade.next(elements, settings, current, last);
        }), settings.timeout);
    };

})(jQuery);

// **** remove Opacity-Filter in ie ****
function removeFilter(element) {
	if(element.style.removeAttribute){
		element.style.removeAttribute('filter');
	}
}
//////////////////:
$(document).ready(function(){
	
		
	actualite_accueil();
		
	$('#formrecherche').on('submit', function() {
	var nom = $("input[name=nom]").attr("value");
	var ville = $("input[name=ville]").attr("value");
	var output = $('#output_listing_recherche');
	output.empty();
	if(nom == '') {
        alert('Le champ est vide');
        } else {
		output.append('Chargement');
		var list = new Array();
		$.ajax({
			url: 'http://notaires-appli.com/notaires74-73/php/recherche.php?nom='+nom+'',
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			timeout: 5000,
			success: function(data, status){
				output.empty();
				$.each(data, function(i,item){
					var donnee = '<li data-theme="c"><a href="#page6" id="'+item.id+'" data-transition="slide">'+item.nom+' '+item.prenom+'</a></li>';
					list.push(item.text);
					output.append(donnee);
				});
				output.listview("refresh");
				console.log(list.length);
				if(list.length ==0){
					output.append("Pas de résultat");
				}
			},
			error : function() { // Info Debuggage si erreur          
                  alert("Erreur : "+request.responseText.error);
            }
		});
	} 
	return false; // j'empêche le navigateur de soumettre lui-même le formulaire
    });
	
	
});


/////////////////////////////////////////////////////////////////////////////////////

(function($) {
  $.widget('mobile.tabbar', $.mobile.navbar, {
    _create: function() {
      // Set the theme before we call the prototype, which will 
      // ensure buttonMarkup() correctly grabs the inheritied theme.
      // We default to the "a" swatch if none is found
      var theme = this.element.jqmData('theme') || "a";
      this.element.addClass('ui-footer ui-footer-fixed ui-bar-' + theme);

      // Make sure the page has padding added to it to account for the fixed bar
      this.element.closest('[data-role="page"]').addClass('ui-page-footer-fixed');


      // Call the NavBar _create prototype
      $.mobile.navbar.prototype._create.call(this);
    },

    // Set the active URL for the Tab Bar, and highlight that button on the bar
    setActive: function(url) {
      // Sometimes the active state isn't properly cleared, so we reset it ourselves
      this.element.find('a').removeClass('ui-btn-active ui-state-persist');
      this.element.find('a[href="' + url + '"]').addClass('ui-btn-active ui-state-persist');
    }
  });

  $(document).bind('pagecreate create', function(e) {
    return $(e.target).find(":jqmData(role='tabbar')").tabbar();
  });
  
  $(":jqmData(role='page')").live('pageshow', function(e) {
    // Grab the id of the page that's showing, and select it on the Tab Bar on the page
    var tabBar, id = $(e.target).attr('id');

    tabBar = $.mobile.activePage.find(':jqmData(role="tabbar")');
    if(tabBar.length) {
      tabBar.tabbar('setActive', '#' + id);
    }
  });

var attachEvents = function() {
	var hoverDelay = $.mobile.buttonMarkup.hoverDelay, hov, foc;

	$( document ).bind( {
		"vmousedown vmousecancel vmouseup vmouseover vmouseout focus blur scrollstart": function( event ) {
			var theme,
				$btn = $( closestEnabledButton( event.target ) ),
				evt = event.type;
		
			if ( $btn.length ) {
				theme = $btn.attr( "data-" + $.mobile.ns + "theme" );
		
				if ( evt === "vmousedown" ) {
					if ( $.support.touch ) {
						hov = setTimeout(function() {
							$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-down-" + theme );
						}, hoverDelay );
					} else {
						$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-down-" + theme );
					}
				} else if ( evt === "vmousecancel" || evt === "vmouseup" ) {
					$btn.removeClass( "ui-btn-down-" + theme ).addClass( "ui-btn-up-" + theme );
				} else if ( evt === "vmouseover" || evt === "focus" ) {
					if ( $.support.touch ) {
						foc = setTimeout(function() {
							$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-hover-" + theme );
						}, hoverDelay );
					} else {
						$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-hover-" + theme );
					}
				} else if ( evt === "vmouseout" || evt === "blur" || evt === "scrollstart" ) {
					$btn.removeClass( "ui-btn-hover-" + theme  + " ui-btn-down-" + theme ).addClass( "ui-btn-up-" + theme );
					if ( hov ) {
						clearTimeout( hov );
					}
					if ( foc ) {
						clearTimeout( foc );
					}
				}
			}
		},
		"focusin focus": function( event ){
			$( closestEnabledButton( event.target ) ).addClass( $.mobile.focusClass );
		},
		"focusout blur": function( event ){
			$( closestEnabledButton( event.target ) ).removeClass( $.mobile.focusClass );
		}
	});

	attachEvents = null;
};

$.fn.buttonMarkup = function( options ) {
	var $workingSet = this;

	// Enforce options to be of type string
	options = ( options && ( $.type( options ) == "object" ) )? options : {};
	for ( var i = 0; i < $workingSet.length; i++ ) {
		var el = $workingSet.eq( i ),
			e = el[ 0 ],
			o = $.extend( {}, $.fn.buttonMarkup.defaults, {
				icon:       options.icon       !== undefined ? options.icon       : el.jqmData( "icon" ),
				iconpos:    options.iconpos    !== undefined ? options.iconpos    : el.jqmData( "iconpos" ),
				theme:      options.theme      !== undefined ? options.theme      : el.jqmData( "theme" ) || $.mobile.getInheritedTheme( el, "c" ),
				inline:     options.inline     !== undefined ? options.inline     : el.jqmData( "inline" ),
				shadow:     options.shadow     !== undefined ? options.shadow     : el.jqmData( "shadow" ),
				corners:    options.corners    !== undefined ? options.corners    : el.jqmData( "corners" ),
				iconshadow: options.iconshadow !== undefined ? options.iconshadow : el.jqmData( "iconshadow" ),
				iconsize:   options.iconsize   !== undefined ? options.iconsize   : el.jqmData( "iconsize" ),
				mini:       options.mini       !== undefined ? options.mini       : el.jqmData( "mini" )
			}, options ),

			// Classes Defined
			innerClass = "ui-btn-inner",
			textClass = "ui-btn-text",
			buttonClass, iconClass,
			// Button inner markup
			buttonInner,
			buttonText,
			buttonIcon,
			buttonElements;

		$.each(o, function(key, value) {
			e.setAttribute( "data-" + $.mobile.ns + key, value );
			el.jqmData(key, value);
		});

		// Check if this element is already enhanced
		buttonElements = $.data(((e.tagName === "INPUT" || e.tagName === "BUTTON") ? e.parentNode : e), "buttonElements");

		if (buttonElements) {
			e = buttonElements.outer;
			el = $(e);
			buttonInner = buttonElements.inner;
			buttonText = buttonElements.text;
			// We will recreate this icon below
			$(buttonElements.icon).remove();
			buttonElements.icon = null;
		}
		else {
			buttonInner = document.createElement( o.wrapperEls );
			buttonText = document.createElement( o.wrapperEls );
		}
		buttonIcon = o.icon ? document.createElement( "span" ) : null;

		if ( attachEvents && !buttonElements) {
			attachEvents();
		}
		
		// if not, try to find closest theme container	
		if ( !o.theme ) {
			o.theme = $.mobile.getInheritedTheme( el, "c" );	
		}		

		buttonClass = "ui-btn ui-btn-up-" + o.theme;
		buttonClass += o.inline ? " ui-btn-inline" : "";
		buttonClass += o.shadow ? " ui-shadow" : "";
		buttonClass += o.corners ? " ui-btn-corner-all" : "";

		if ( o.mini !== undefined ) {
			// Used to control styling in headers/footers, where buttons default to `mini` style.
			buttonClass += o.mini ? " ui-mini" : " ui-fullsize";
		}
		
		if ( o.inline !== undefined ) {			
			// Used to control styling in headers/footers, where buttons default to `mini` style.
			buttonClass += o.inline === false ? " ui-btn-block" : " ui-btn-inline";
		}
		
		
		if ( o.icon ) {
			o.icon = "ui-icon-" + o.icon;
			o.iconpos = o.iconpos || "left";

			iconClass = "ui-icon " + o.icon;

			if ( o.iconshadow ) {
				iconClass += " ui-icon-shadow";
			}

			if ( o.iconsize ) {
				iconClass += " ui-iconsize-" + o.iconsize;
			}
		}

		if ( o.iconpos ) {
			buttonClass += " ui-btn-icon-" + o.iconpos;

			if ( o.iconpos == "notext" && !el.attr( "title" ) ) {
				el.attr( "title", el.getEncodedText() );
			}
		}
    
		innerClass += o.corners ? " ui-btn-corner-all" : "";

		if ( o.iconpos && o.iconpos === "notext" && !el.attr( "title" ) ) {
			el.attr( "title", el.getEncodedText() );
		}

		if ( buttonElements ) {
			el.removeClass( buttonElements.bcls || "" );
		}
		el.removeClass( "ui-link" ).addClass( buttonClass );

		buttonInner.className = innerClass;

		buttonText.className = textClass;
		if ( !buttonElements ) {
			buttonInner.appendChild( buttonText );
		}
		if ( buttonIcon ) {
			buttonIcon.className = iconClass;
			if ( !(buttonElements && buttonElements.icon) ) {
				buttonIcon.appendChild( document.createTextNode("\u00a0") );
				buttonInner.appendChild( buttonIcon );
			}
		}

		while ( e.firstChild && !buttonElements) {
			buttonText.appendChild( e.firstChild );
		}

		if ( !buttonElements ) {
			e.appendChild( buttonInner );
		}

		// Assign a structure containing the elements of this button to the elements of this button. This
		// will allow us to recognize this as an already-enhanced button in future calls to buttonMarkup().
		buttonElements = {
			bcls  : buttonClass,
			outer : e,
			inner : buttonInner,
			text  : buttonText,
			icon  : buttonIcon
		};

		$.data(e,           'buttonElements', buttonElements);
		$.data(buttonInner, 'buttonElements', buttonElements);
		$.data(buttonText,  'buttonElements', buttonElements);
		if (buttonIcon) {
			$.data(buttonIcon, 'buttonElements', buttonElements);
		}
	}

	return this;
};

$.fn.buttonMarkup.defaults = {
	corners: true,
	shadow: true,
	iconshadow: true,
	iconsize: 18,
	wrapperEls: "span"
};

function closestEnabledButton( element ) {
    var cname;

    while ( element ) {
		// Note that we check for typeof className below because the element we
		// handed could be in an SVG DOM where className on SVG elements is defined to
		// be of a different type (SVGAnimatedString). We only operate on HTML DOM
		// elements, so we look for plain "string".
        cname = ( typeof element.className === 'string' ) && (element.className + ' ');
        if ( cname && cname.indexOf("ui-btn ") > -1 && cname.indexOf("ui-disabled ") < 0 ) {
            break;
        }

        element = element.parentNode;
    }

    return element;
}

	
})(jQuery);
//////  google maps //////////


/*$(document).on( "pageinit", function() {
	function scale( width, height, padding, border ) {
		var scrWidth = $( window ).width() - 30,
			scrHeight = $( window ).height() - 30,
			ifrPadding = 2 * padding,
			ifrBorder = 2 * border,
			ifrWidth = width + ifrPadding + ifrBorder,
			ifrHeight = height + ifrPadding + ifrBorder,
			h, w;

		if ( ifrWidth < scrWidth && ifrHeight < scrHeight ) {
			w = ifrWidth;
			h = ifrHeight;
		} else if ( ( ifrWidth / scrWidth ) > ( ifrHeight / scrHeight ) ) {
			w = scrWidth;
			h = ( scrWidth / ifrWidth ) * ifrHeight;
		} else {
			h = scrHeight;
			w = ( scrHeight / ifrHeight ) * ifrWidth;
		}
		
		return {
			'width': w - ( ifrPadding + ifrBorder ),
			'height': h - ( ifrPadding + ifrBorder )
		};
	};

    $( "#popupMap iframe" )
        .attr( "width", 0 )
        .attr( "height", 0 );
		  
    $( "#popupMap iframe" ).contents().find( "#map_canvas" )
        .css( { "width" : 0, "height" : 0 } );
	 	     
    $( "#popupMap" ).on({
        popupbeforeposition: function() {
            var size = scale( 480, 320, 0, 1 ),
                w = size.width,
                h = size.height;

            $( "#popupMap iframe" )
                .attr( "width", w )
                .attr( "height", h );
					 
            $( "#popupMap iframe" ).contents().find( "#map_canvas" )
                .css( { "width": w, "height" : h } );
        },
        popupafterclose: function() {
			
            $( "#popupMap iframe" )
                .attr( "width", 0 )
                .attr( "height", 0 );
					 
            $( "#popupMap iframe" ).contents().find( "#map_canvas" )
                .css( { "width": 0, "height" : 0 } );
        }
    });
});*/
///////////////////////      google maps  ///////////////////////
var map, latlng, myoptions;
var markers = new Array();
var i = 0;
function clearOverlays() {
  for (var i = 0; i < markers.length; i++ ) {
    markers[i].setMap(null);
  }
}

function initialize() {
	latlng = new google.maps.LatLng(40.716948, -74.003563);
	myoptions = { zoom: 14, center: latlng, mapTypeId: google.maps.MapTypeId.ROADMAP };
	map = new google.maps.Map(document.getElementById("map"), myoptions);
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		visible: true
	});
}
$('.page-map').live("pagecreate", function() {
	initialize();
});

$('.page-map').live('pageshow',function(){
	//console.log("test");
	googlemaps();
	google.maps.event.trigger(map, 'resize');
	map.setOptions(myoptions); 
});
function googlemaps(){	  
	var address = window.localStorage.getItem("url");
	console.log(address);
	geocoder = new google.maps.Geocoder();
	geocoder.geocode({ 'address': address }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			clearOverlays();
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});
			markers.push(marker);
			google.maps.event.addListener(marker,"click",function(){});
		} else {
			alert("L'adresse est invalide");
			console.log(address);
  		}
	});  
}



  