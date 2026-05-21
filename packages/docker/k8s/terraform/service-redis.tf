resource "kubernetes_service" "bades_redis" {
  metadata {
    name      = "${var.bades_app_name}-redis"
    namespace = kubernetes_namespace.bades.metadata.0.name
  }
  spec {
    selector = {
      app = "${var.bades_app_name}-redis"
    }
    session_affinity = "ClientIP"
    port {
      port        = 6379
      target_port = 6379
    }

    type = "ClusterIP"
  }
}
