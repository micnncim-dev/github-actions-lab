workflow "workflow" {
  on = "push"
  resolve = ["hello-world"]
}

action "hello-world" {
  uses = "./action-hello-world/"
  args = "Hello world"
}