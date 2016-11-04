# os deps: node npm git
# npm deps: eslint npm-check-updates yarn

lint:
	eslint *.js

test:
	node test

publish:
	if git ls-remote --exit-code origin &>/dev/null; then git push -u -f --tags origin master; fi
	if git ls-remote --exit-code gogs &>/dev/null; then git push -u -f --tags gogs master; fi
	npm publish

update:
	ncu --packageFile package.json -ua
	rm -rf node_modules
	yarn

npm-patch:
	npm version patch

npm-minor:
	npm version minor

npm-major:
	npm version major

patch: lint test npm-patch publish
minor: lint test npm-minor publish
major: lint test npm-major publish

.PHONY: lint publish update npm-patch npm-minor npm-major patch minor major
