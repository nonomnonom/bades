# Delegasi ke packages/bades-docker (selaras Twenty: packages/twenty-docker/Makefile)
#   make -C packages/bades-docker prod-build
.PHONY: prod-build prod-run stack-up stack-down prod-up prod-down dev-infra-up dev-infra-down dev-bootstrap
prod-build prod-run stack-up stack-down prod-up prod-down dev-infra-up dev-infra-down dev-bootstrap:
	@$(MAKE) -C packages/bades-docker $@
