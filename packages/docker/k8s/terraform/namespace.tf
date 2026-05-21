resource "kubernetes_namespace" "bades" {
  metadata {
    annotations = {
      name = var.bades_namespace
    }

    name = var.bades_namespace
  }
}
