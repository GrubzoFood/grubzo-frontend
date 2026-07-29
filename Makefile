REPO ?= rohana001
IMAGE_NAME ?= grubzo-frontend
TAG ?= $(shell git rev-parse --short HEAD)
HOOKS_DIR ?= .githooks

.PHONY: run docker-build docker-push install-hooks lint test

run:
	@echo "Starting frontend..."
	@npm run dev

lint:
	npm run lint

test:
	npm test

docker-build:
	docker build -t $(REPO)/$(IMAGE_NAME):$(TAG) .

docker-push:
	docker push $(REPO)/$(IMAGE_NAME):$(TAG)

install-hooks:
	@git config core.hooksPath $(HOOKS_DIR)
	@chmod +x $(HOOKS_DIR)/pre-commit $(HOOKS_DIR)/pre-push
	@echo "Git hooks installed from $(HOOKS_DIR)"


# make docker-build TAG=v0.1.1
# make docker-push TAG=v0.1.1
