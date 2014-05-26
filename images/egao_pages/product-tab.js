(function($) {
	$( function() {
		var $window = window.$window;
		var $html = window.$html;
		if( $html.hasClass( 'pagemode-pageeditorediting' ) ) return;

		var ajaxHandlers = {};

		var bindLinks =
			function( $rootItem ) {
				var $tabLinks = $( '.etproducttabfoldernavigationitem-item', $rootItem );

				$tabLinks.each( function() {
					var $tabLink = $(this);

					var href = $tabLink.attr( 'href' );

					var itemName = $tabLink.data( 'itemname' );
					$tabLink.attr( { href: '#tab=' + encodeURIComponent( itemName ) } );

                    //Tracking tab click
					$tabLink.click(function () {
						Analytics.TrackPageview( href );
					});

					ajaxHandlers[ itemName ] =
						function() {
							delete ajaxHandlers[ itemName ];
							$rootItem.addClass( 'loading' );

							$rootItem.load(
								$.param.querystring( href, {
									sc_ajax: 1,
									ref: $.param.fragment( href, {}, 2 )
								} ) + ' #ajax-result',
								function() {
									$rootItem.removeClass( 'loading' );
									bindLinks( $rootItem );
								}
							);
						};
				} );
			};

		$( '.etproducttabfolder-ajax' ).each( function() {
			var state = $.bbq.getState();
			if( state.tab ) {
				var matchingItem =
					$( '.etproducttabfoldernavigationitem-item', this )
					.filter( function() {
						return $(this).data( 'itemname' ) === state.tab;
					} );

				if( matchingItem.length === 1 ) location.replace( matchingItem.attr( 'href' ) );
				return;
			}

			bindLinks( $(this) );
		} );

		$window.bind( 'hashchange', function() {
			var state = $.bbq.getState();
			if( state.tab ) {
				var handler = ajaxHandlers[ state.tab ];
				if( handler ) handler();
			}
		} );

        var $carouselElem = $('.jecarousel');
        if ($carouselElem.length > 0) {
            $carouselElem.jeCarousel();
        }

	} );
}( jQuery ));