let status = 200

const mockResponse = {
  status: jest.fn(() => status)
}

export const __setResponseStatus = (newStatus: number): void => {
  status = newStatus
}

const mockPage = {
  cookies: jest.fn().mockReturnValue([]),
  setViewport: jest.fn(),
  on: jest.fn(),
  setRequestInterception: jest.fn(),
  setDefaultNavigationTimeout: jest.fn(),
  goto: jest.fn().mockReturnValue(mockResponse),
  close: jest.fn()
}

const mockBrowser = {
  newPage: jest.fn().mockReturnValue(mockPage),
  close: jest.fn()
}

const mockLaunch = jest.fn().mockReturnValue(mockBrowser)

export const launch = mockLaunch
