resource "kubernetes_persistent_volume_claim" "server" {
  metadata {
    name      = "${var.bades_app_name}-server-pvc"
    namespace = kubernetes_namespace.bades.metadata.0.name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = var.bades_server_pvc_requests
      }
    }
    volume_name = kubernetes_persistent_volume.server.metadata.0.name
  }
}
