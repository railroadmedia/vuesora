// https://docs.cypress.io/api/introduction/api.html

// describe("Check if Media Element was Created.", () => {
//   it("Generates a video element", () => {
//     cy.visit("http://localhost:8080/#/");
//     cy.get("mediaelementwrapper > video");
//   });
//   it("Generates source tags", () => {
//     cy.visit("http://localhost:8080/#/");
//     cy.get("video > source").then(() => {
//       cy
//         .get("video > source:first")
//         .should(
//           "have.attr",
//           "src",
//           "https://player.vimeo.com/external/255087433.hd.mp4?s=41e2cf6a03299ea200bfd7d8a7005b672055a137&profile_id=175"
//         );
//     });
//   });
// });
// describe("Check Video Controls.", () => {
//   it("Can Play, Seek and Pause", () => {
//     cy.visit("http://localhost:8080/#/");
//     cy.log("Clicking the Play Button");
//     cy.get(".media-element").trigger("mouseenter");
//     cy
//       .get(".mejs__playpause-button")
//       .click()
//       .then(() => {
//         cy.window().then(win => {
//           cy.wait(2000).then(() => {
//             expect(win.player.paused).to.equal(false);
//           });
//         });
//       });
//     cy.log("Clicking on the Time Rail");
//     cy.window().then(win => {
//       let oldTime = win.player.currentTime;
//
//       cy.get(".media-element").trigger("mouseenter");
//       cy
//         .get(".mejs__time-slider")
//         .click()
//         .then(() => {
//           let newTime = win.player.currentTime;
//
//           expect(newTime).to.not.equal(oldTime);
//         });
//       cy.wait(2000);
//     });
//     cy.log("Clicking the Pause Button");
//
//     cy.get(".media-element").trigger("mouseenter");
//     cy
//       .get(".mejs__playpause-button")
//       .click()
//       .then(() => {
//         cy.window().then(win => {
//           expect(win.player.paused).to.equal(true);
//         });
//       });
//   });
//   it("Can Fullscreen", () => {
//     cy.visit("http://localhost:8080/#/");
//     cy.log("Clicking the Fullscreen Button");
//     cy.get(".media-element").trigger("mouseenter");
//     cy.get(".mejs__fullscreen-button").click();
//     cy.wait(3000);
//     cy.get(".mejs__fullscreen-button").click();
//   });
// });
