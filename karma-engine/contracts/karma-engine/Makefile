default: build

build:
	cargo build --target wasm32-unknown-unknown --release

test:
	cargo test

clean:
	cargo clean

deploy: build
	soroban contract deploy \
		--wasm target/wasm32-unknown-unknown/release/karma_engine.wasm \
		--source ${SOURCE_ACCOUNT} \
		--rpc-url ${RPC_URL} \
		--network-passphrase "${NETWORK_PASSPHRASE}"

.PHONY: default build test clean deploy