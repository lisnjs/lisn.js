#!/bin/bash

mkdir -p tmp || exit $?
# remove CSS from the bundle
echo 'sed "/^ *var css_/d" dist/bundle/lisn.js > tmp/lisn.js'
sed '/^ *var css_/d' dist/bundle/lisn.js >tmp/lisn.js || exit $?

cat <<EOF
npx uglify-js \
	--compress keep_infinity=true,passes=3 \
	--mangle --mangle-props regex='/^_/' \
	tmp/lisn.js --output tmp/lisn.min.js
EOF

npx uglify-js \
	--compress keep_infinity=true,passes=3 \
	--mangle --mangle-props regex='/^_/' \
	tmp/lisn.js --output tmp/lisn.min.js || exit $?

# print info about words of more than 5 characters that are present more than
# three times
echo
grep -Eo '[a-zA-Z_-]{5,}' tmp/lisn.min.js |
	sort |
	grep -Ev '^(await|async|return|constructor|super|throw|extends|function|class|static)$' |
	uniq -c |
	awk '
BEGIN {
  tb = 0;
  print "duplicate\tbytes\tstring";
}

{
  n = $1;
  s = $2;
  l = n * length(s);
  if (n > 3) {
    result[l] = n "\t\t" l "\t" s;
    tb += l;
  }
}

END {
  for (i in result) {
    print result[i];
  }
  print "---- total bytes to be possibly saved: " tb;
}'
