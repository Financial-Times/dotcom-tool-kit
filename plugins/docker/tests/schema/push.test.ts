import schema from '../../src/schema'

describe('docker push schema', () => {
  it('should apply defaults to an image', () => {
    expect(
      schema.safeParse({
        images: {
          image: {
            name: 'test-image'
          }
        }
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "images": {
            "image": {
              "definition": "Dockerfile",
              "name": "test-image",
              "platform": "linux/arm64",
              "registry": "docker.packages.ft.com/cp-container-registry",
            },
          },
        },
        "success": true,
      }
    `)
  })

  it('should allow only expected image keys through', () => {
    expect(
      schema.safeParse({
        images: {
          image: {
            definition: 'Dockerfile.test',
            platform: 'macos/arm64',
            registry: 'https://hub.docker.com',
            name: 'test-image',
            another: 'key'
          }
        }
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "images": {
            "image": {
              "definition": "Dockerfile.test",
              "name": "test-image",
              "platform": "macos/arm64",
              "registry": "https://hub.docker.com",
            },
          },
        },
        "success": true,
      }
    `)
  })
})
