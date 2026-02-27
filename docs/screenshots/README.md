# Screenshots for Adaptive Learning Mode

This directory contains screenshots and visual aids used in the **Adaptive Learning** feature of AWSPrepAI.

## Current Files

- `placeholder.svg` — Generic AWS Console placeholder displayed when a real screenshot is not available.

## Adding Real AWS Console Screenshots

To enhance the Beginner and Intermediate learning modes with actual AWS Console screenshots:

### Naming Convention

Name screenshots to match the feature being demonstrated:

```
[service]-[feature]-[action].png

Examples:
  s3-default-encryption-enable.png
  iam-role-attach-ec2.png
  rds-multi-az-enable.png
  elasticache-create-cluster.png
  sqs-fifo-create.png
```

### Recommended Specifications

| Property      | Recommended Value           |
|---------------|-----------------------------|
| Format        | PNG or JPEG                 |
| Dimensions    | 800 × 500 px                |
| Max file size | 200 KB (compress if needed) |
| Capture area  | Relevant console panel only |
| Annotations   | Highlight the key control   |

### How to Reference Screenshots in Question Data

Add a `visualGuide` field to any question object:

```javascript
{
  cat: "design-secure",
  q: "How do you enable default encryption on an S3 bucket?",
  options: ["...", "...", "...", "..."],
  answer: 1,
  explain: "...",
  hint1: "...",
  hint2: "...",
  awsConsolePath: "S3 → Buckets → [Name] → Properties → Default encryption",
  visualGuide: {
    type: "console-screenshot",
    correctOption: "screenshots/s3-default-encryption-enable.png",
    wrongOptions: {
      0: "screenshots/s3-object-lock.png",
      2: "screenshots/s3-lifecycle-rules.png",
      3: "screenshots/aws-config-rules.png"
    }
  }
}
```

### Tips

- Blur or redact any account IDs, ARNs, or personal information before committing screenshots.
- Use browser zoom to capture at a readable size.
- Annotate with a red border or arrow to highlight the relevant UI element.

## Phase 2 Roadmap

Real screenshots will be added progressively for the 8 enhanced sample questions included in the initial release:

- [ ] `s3-default-encryption-enable.png`
- [ ] `iam-role-attach-ec2.png`
- [ ] `rds-multi-az-enable.png`
- [ ] `elasticache-create-cluster.png`
- [ ] `s3-storage-class-standard-ia.png`
- [ ] `sqs-fifo-create.png`
- [ ] `iam-cross-account-role.png`
- [ ] `ec2-spot-instance-launch.png`
