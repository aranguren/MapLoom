(function() {
  var module = angular.module('loom_diff_panel_directive', []);

  module.directive('loomDiffPanel', function($rootScope, $translate, diffService, conflictService,
                                             pulldownService, dialogService) {
        return {
          restrict: 'C',
          replace: true,
          templateUrl: 'diff/partial/diffpanel.tpl.html',
          link: function(scope) { // Unused: element, attrs
            function updateVariables() {
              scope.adds = diffService.adds;
              scope.modifies = diffService.modifies;
              scope.deletes = diffService.deletes;
              scope.conflicts = diffService.conflicts;
              scope.merges = diffService.merges;
              scope.diffService = diffService;
              scope.featureClicked = diffService.clickCallback;
              scope.mergeButtons = diffService.mergeDiff;
              scope.conflictsText = $translate('complete_merge');
              if (scope.numConflicts === 1) {
                scope.conflictsText = $translate('single_conflict');
              } else if (scope.numConflicts > 1) {
                scope.conflictsText = $translate('multiple_conflicts', {value: scope.numConflicts});
              }
            }

            updateVariables();

            scope.$watch('diffService.adds', updateVariables, true);
            scope.$watch('diffService.modifies', updateVariables, true);
            scope.$watch('diffService.deletes', updateVariables, true);
            scope.$watch('diffService.merges', updateVariables, true);
            scope.$watch('diffService.conflicts', updateVariables, true);
            scope.$watch('diffService.clickCallback', updateVariables);

            scope.cancel = function() {
              dialogService.warn($translate('warning'), $translate('sure_cancel_merge'),
                  [$translate('yes_btn'), $translate('no_btn')], false).then(function(button) {
                switch (button) {
                  case 0:
                    diffService.clearDiff();
                    conflictService.abort();
                    pulldownService.defaultMode();
                    break;
                  case 1:
                    break;
                }
              });
            };

            scope.done = function() {
              dialogService.open($translate('commit_merge'), $translate('sure_commit_merge'),
                  [$translate('yes_btn'), $translate('no_btn')], false).then(function(button) {
                switch (button) {
                  case 0:
                    conflictService.commit();
                    break;
                  case 1:
                    break;
                }
              });
            };
          }
        };
      });
}());
