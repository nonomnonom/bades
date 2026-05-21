resource "kubernetes_persistent_volume_claim" "db" {
  metadata {
    name      = "${var.bades_app_name}-db-pvc"
    namespace = kubernetes_namespace.bades.metadata.0.name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = var.bades_db_pvc_requests
      }
    }
    volume_name = kubernetes_persistent_volume.db.metadata.0.name
  }
}
