class TestCI {
   async verify() {
      return false
   }

   async install() {
      console.log('installing test:ci')
   }
}

class TestLocal {
   async verify() {
      return false
   }

   async install() {
      console.log('installing test:local')
   }
}

class TestDeploy {
   async verify() {
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
