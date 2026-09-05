sed -i '' -e 's/<style>/<style>\
    :root {\
      --ui-size-base: 12px;\
      --ui-size-sm: 11px;\
      --ui-size-lg: 13px;\
    }\
\
    [data-theme="midnight"],\
    [data-theme="sepia"],\
    [data-theme="blackwhite"] {\
      --ui-size-base: 14.5px;\
      --ui-size-sm: 13px;\
      --ui-size-lg: 17px;\
    }/g' /Users/minhlocnguyen/repos/git_test/globe-test.html

sed -i '' -e 's/font-size: 12px;/font-size: var(--ui-size-base);/g' /Users/minhlocnguyen/repos/git_test/globe-test.html
sed -i '' -e 's/font-size: 11px;/font-size: var(--ui-size-sm);/g' /Users/minhlocnguyen/repos/git_test/globe-test.html
sed -i '' -e 's/font-size: 13px;/font-size: var(--ui-size-lg);/g' /Users/minhlocnguyen/repos/git_test/globe-test.html
