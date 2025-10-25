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
		--rpc-url https://soroban-testnet.stellar.org:443 \
		--network-passphrase "Test SDF Network ; September 2015"

# Deploy with environment variables
deploy-env: build
	soroban contract deploy \
		--wasm target/wasm32-unknown-unknown/release/karma_engine.wasm \
		--source ${ACCOUNT_SECRET_KEY} \
		--rpc-url https://soroban-testnet.stellar.org:443 \
		--network-passphrase "Test SDF Network ; September 2015"

.PHONY: default build test clean deploy deploy-env