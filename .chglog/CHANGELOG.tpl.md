{{ range .Versions }}
## Changelog

{{ range .CommitGroups -}}
{{ range .Commits -}}
- [`{{ .Hash.Short }}`](https://github.com/micnncim/github-actions-lab/commit/{{ .Hash.Long }}): {{ .Header }}{{ if .Merge }}({{ .Merge.Ref }}){{ end }}
{{ end -}}
{{ end -}}
{{ end -}}