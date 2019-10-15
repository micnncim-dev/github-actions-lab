package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
)

type GitHubContext struct {
	Repository string `json:"repository"`
	Event      struct {
		Issue struct {
			Number int `json:"number"`
		}
		Comment struct {
			ID   int    `json:"id"`
			Body string `json:"body"`
		} `json:"comment"`
		PullRequest struct {
			Number int `json:"number"`
		} `json:"pull_request"`
		Review struct {
			ID   int    `json:"id"`
			Body string `json:"body"`
		} `json:"review"`
	} `json:"event"`
}

func main() {
	eventContext := os.Getenv("GITHUB_EVENT")
	fmt.Println(eventContext)

	githubContext := os.Getenv("GITHUB")
	fmt.Println(githubContext)

	var gc GitHubContext
	if err := json.Unmarshal([]byte(githubContext), &gc); err != nil {
		log.Fatal(err)
	}

	fmt.Printf("%#v\n", gc)
}
