class TestCI {
   async check() {
      return false
   }

   async install() {
      console.log('installing test:ci')
   }
}

class TestLocal {
   async check() {
      return false
   }

   async install() {
      console.log('installing test:local')
   }
}

class TestDeploy {
   async check() {
      return false
   }

   async install() {
      console.log('installing test:deploy')
   }
}

export const lifecycles = {
   'test:local': TestLocal,
   'test:ci': TestCI,
   'test:deploy': TestDeploy
}
