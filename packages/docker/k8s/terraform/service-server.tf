resource "kubernetes_service" "bades_server" {
  metadata {
    name      = "${var.bades_app_name}-server"
    namespace = kubernetes_namespace.bades.metadata.0.name
  }
  spec {
    selector = {
      app = "${var.bades_app_name}-server"
    }
    session_affinity = "ClientIP"
    port {
      name        = "http-tcp"
      port        = 3000
      target_port = 3000
    }

    type = "ClusterIP"
  }
}
