resource "kubernetes_service" "bades_db" {
  metadata {
    name      = "${var.bades_app_name}-db"
    namespace = kubernetes_namespace.bades.metadata.0.name
  }
  spec {
    selector = {
      app = "${var.bades_app_name}-db"
    }
    session_affinity = "ClientIP"
    port {
      port        = 5432
      target_port = 5432
    }

    type = "ClusterIP"
  }
}
