default: build

build:
	cargo build --target wasm32-unknown-unknown --release
	mkdir -p ../../target/wasm32-unknown-unknown/release/
	cp target/wasm32-unknown-unknown/release/*.wasm ../../target/wasm32-unknown-unknown/release/

test:
	cargo test

clean:
	cargo clean
	rm -rf ../../target/wasm32-unknown-unknown/release/karma_engine*

.PHONY: default build test clean