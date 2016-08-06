angular.module('starter.services')
  .factory('Scroller', function ($ionicPosition, $ionicScrollDelegate, $timeout) {
    function findScrollParent(element) {
      if (!element) return null;
      var jqElement = angular.element(element);

      var parents = jqElement.parent();
      if (!parents || !parents.length) {
        console.log('No parent for element');
        return null;
      }

      if (parents.hasClass('scroll-content')) {
        console.log('Found parent with .scroll-content');
        return parents[0];
      }

      console.log('Traversing up the tree');
      var parent = findScrollParent(parents[0]);
      console.log({ 'Found': parent });
      return parent;
    }

    function findElementById(elementId) {
      console.log('document.getElementById(\'' + elementId + '\');')
      var element = document.getElementById(elementId);
      console.log({ 'Found': element });
      return element;
    }

    function getScrollDelegateHandle(element) {
      const delegateHandleAttrName = 'delegate-handle';

      if (!element) {
        console.log('No element passed in to findScrollDelegateHandle');
        return null;
      }

      var delegateHandle = angular.element(element).attr(delegateHandleAttrName);
      if (!delegateHandle) {
        console.log('Couldn\'t find delegate handle attribute on element');
        return null;
      }
      return $ionicScrollDelegate.$getByHandle(delegateHandle);
    }

    var scroller = {
      scrollTo: function (elementId) {
        console.log('Scrolling to ' + elementId);

        var element = findElementById(elementId);
        if (!element) {
          console.log('Couldn\'t find element ' + elementId);
          return;
        }

        var parent = findScrollParent(element);
        if (!parent) {
          console.log('Couldn\'t find parent');
          return;
        }

        var scrollDelegate = getScrollDelegateHandle(parent);
        if (!scrollDelegate) {
          console.log('Couldn\'t find scrollDelegate for element');
          return;
        }

        var position = $ionicPosition.position(angular.element(element));
        if (!position) {
          console.log('Couldn\'t find position for element');
          return;
        } else {
          console.log(position);
        }

        $timeout(function () {scrollDelegate.scrollTo(0, position.top, true);}, 0);
      }
    }
    return scroller;
  });