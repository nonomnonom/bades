######################
# Required Variables #
######################
variable "bades_pgdb_admin_password" {
  type        = string
  description = "Bades password for postgres database."
  sensitive   = true
}

variable "bades_app_hostname" {
  type        = string
  description = "The protocol, DNS fully qualified hostname, and port used to access Bades in your environment. Ex: https://crm.example.com:443"
}

######################
# Optional Variables #
######################
variable "bades_app_name" {
  type        = string
  default     = "bades"
  description = "A friendly name prefix to use for every component deployed."
}

variable "bades_server_image" {
  type        = string
  default     = "badesid/bades:latest"
  description = "Bades server image for the server deployment. This defaults to latest. This value is also used for the workers image."
}

variable "bades_db_image" {
  type        = string
  default     = "badesid/bades-postgres-spilo:latest"
  description = "Bades image for database deployment. This defaults to latest."
}

variable "bades_server_replicas" {
  type        = number
  default     = 1
  description = "Number of replicas for the Bades server deployment. This defaults to 1."
}

variable "bades_worker_replicas" {
  type        = number
  default     = 1
  description = "Number of replicas for the Bades worker deployment. This defaults to 1."
}

variable "bades_db_replicas" {
  type        = number
  default     = 1
  description = "Number of replicas for the Bades database deployment. This defaults to 1."
}

variable "bades_server_data_mount_path" {
  type        = string
  default     = "/app/packages/bades-server/.local-storage"
  description = "Bades mount path for servers application data. Defaults to '/app/packages/bades-server/.local-storage'."
}

variable "bades_db_pv_path" {
  type        = string
  default     = ""
  description = "Local path to use to store the physical volume if using local storage on nodes."
}

variable "bades_server_pv_path" {
  type        = string
  default     = ""
  description = "Local path to use to store the physical volume if using local storage on nodes."
}

variable "bades_db_pv_capacity" {
  type        = string
  default     = "10Gi"
  description = "Storage capacity provisioned for database persistent volume."
}

variable "bades_db_pvc_requests" {
  type        = string
  default     = "10Gi"
  description = "Storage capacity reservation for database persistent volume claim."
}

variable "bades_server_pv_capacity" {
  type        = string
  default     = "10Gi"
  description = "Storage capacity provisioned for server persistent volume."
}

variable "bades_server_pvc_requests" {
  type        = string
  default     = "10Gi"
  description = "Storage capacity reservation for server persistent volume claim."
}

variable "bades_namespace" {
  type        = string
  default     = "bades"
  description = "Namespace for all Bades resources"
}

variable "bades_redis_replicas" {
  type        = number
  default     = 1
  description = "Number of replicas for the Bades Redis deployment. This defaults to 1."
}

variable "bades_redis_image" {
  type        = string
  default     = "redis/redis-stack-server:latest"
  description = "Bades image for Redis deployment. This defaults to latest."
}

variable "bades_docker_data_mount_path" {
  type        = string
  default     = "/app/docker-data"
  description = "Bades mount path for servers application data. Defaults to '/app/docker-data'."
}

variable "bades_docker_data_pv_path" {
  type        = string
  default     = ""
  description = "Local path to use to store the physical volume if using local storage on nodes."
}

variable "bades_docker_data_pv_capacity" {
  type        = string
  default     = "100Mi"
  description = "Storage capacity provisioned for server persistent volume."
}

variable "bades_docker_data_pvc_requests" {
  type        = string
  default     = "100Mi"
  description = "Storage capacity reservation for server persistent volume claim."
}
