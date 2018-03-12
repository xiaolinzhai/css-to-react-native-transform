import transform from "./index";

describe("misc", () => {
  it("transforms numbers", () => {
    expect(
      transform(`
      .test {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    `),
    ).toEqual({
      test: { top: 0, left: 0, right: 0, bottom: 0 },
    });
  });

  it("allows pixels in unspecialized transform", () => {
    expect(
      transform(`
      .test {
        top: 0px;
      }
    `),
    ).toEqual({
      test: { top: 0 },
    });
  });

  it("allows percent in unspecialized transform", () => {
    expect(
      transform(`
      .test {
        top: 0%;
      }
    `),
    ).toEqual({
      test: { top: "0%" },
    });
  });

  it("allows decimal values", () => {
    expect(
      transform(`
      .test {
        margin-top: 0.5px;
      }
    `),
    ).toEqual({
      test: { marginTop: 0.5 },
    });
    expect(
      transform(`
      .test {
        margin-top: 100.5px;
      }
    `),
    ).toEqual({
      test: { marginTop: 100.5 },
    });
    expect(
      transform(`
      .test {
        margin-top: -0.5px;
      }
    `),
    ).toEqual({
      test: { marginTop: -0.5 },
    });
    expect(
      transform(`
      .test {
        margin-top: -100.5px;
      }
    `),
    ).toEqual({
      test: { marginTop: -100.5 },
    });
    expect(
      transform(`
      .test {
        margin-top: .5px;
      }
    `),
    ).toEqual({
      test: { marginTop: 0.5 },
    });
    expect(
      transform(`
      .test {
        margin-top: -.5px;
      }
    `),
    ).toEqual({
      test: { marginTop: -0.5 },
    });
  });

  it("allows decimal values in transformed values", () => {
    expect(
      transform(`
      .test {
        border-radius: 1.5px;
      }
    `),
    ).toEqual({
      test: {
        borderRadius: 1.5,
      },
    });
  });

  it("allows negative values in transformed values", () => {
    expect(
      transform(`
      .test {
        border-radius: -1.5px;
      }
    `),
    ).toEqual({
      test: {
        borderRadius: -1.5,
      },
    });
  });

  it("allows percent values in transformed values", () => {
    expect(
      transform(`
      .test {
        margin: 10%;
      }
    `),
    ).toEqual({
      test: {
        marginTop: "10%",
        marginRight: "10%",
        marginBottom: "10%",
        marginLeft: "10%",
      },
    });
  });

  it("allows color values in transformed border-color values", () => {
    expect(
      transform(`
      .test {
        border-color: red
      }
    `),
    ).toEqual({
      test: {
        borderColor: "red",
      },
    });
  });

  it("allows omitting units for 0", () => {
    expect(
      transform(`
      .test {
        margin: 10px 0;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 10,
        marginRight: 0,
        marginBottom: 10,
        marginLeft: 0,
      },
    });
  });

  it("converts to camel-case", () => {
    expect(
      transform(`
      .test {
        background-color: red;
      }
    `),
    ).toEqual({
      test: {
        backgroundColor: "red",
      },
    });
  });

  it("transforms shadow offsets", () => {
    expect(
      transform(`
      .test {
        shadow-offset: 10px 5px;
      }
    `),
    ).toEqual({
      test: { shadowOffset: { width: 10, height: 5 } },
    });
  });

  it("transforms text shadow offsets", () => {
    expect(
      transform(`
      .test {
        text-shadow-offset: 10px 5px;
      }
    `),
    ).toEqual({
      test: { textShadowOffset: { width: 10, height: 5 } },
    });
  });

  it("transforms a block of css", () => {
    expect(
      transform(`
    .description {
      margin-bottom: 20px;
      font-size: 18px;
      text-align: center;
      color: #656656;
      box-shadow: 10px 20px 30px #fff;
    }

    .container {
      padding: 30px;
      margin-top: 65px;
      align-items: center;
      border: 2px dashed #f00;
    }
  `),
    ).toEqual({
      description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: "center",
        color: "#656656",
        shadowColor: "#fff",
        shadowOffset: { height: 20, width: 10 },
        shadowRadius: 30,
        shadowOpacity: 1,
      },
      container: {
        paddingBottom: 30,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        marginTop: 65,
        alignItems: "center",
        borderColor: "#f00",
        borderStyle: "dashed",
        borderWidth: 2,
      },
    });
  });

  it("throws useful errors", () => {
    expect(() => {
      transform(`
      .test {
        margin: 10;
      }
    `);
    }).toThrowError('Failed to parse declaration "margin: 10"');
  });

  it("when there are selectors with the same name, merges the common props", () => {
    expect(
      transform(`
      .test {
        margin: 10px;
        background-color: #f00;
      }
      .test {
        padding: 10px;
        font-size: 20px;
        margin: 5px;
      }
    `),
    ).toEqual({
      test: {
        backgroundColor: "#f00",
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        fontSize: 20,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
      },
    });
  });

  it("supports group of selectors", () => {
    expect(
      transform(`
      .test1, .test2 {
        color: red;
      }
    `),
    ).toEqual({
      test1: {
        color: "red",
      },
      test2: {
        color: "red",
      },
    });
  });
});

describe("colors", () => {
  it("transforms named colors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });

  it("transforms hex colors", () => {
    expect(
      transform(`
      .test {
        color: #f00;
      }
    `),
    ).toEqual({
      test: {
        color: "#f00",
      },
    });
  });

  it("transforms rgb colors", () => {
    expect(
      transform(`
      .test {
        color: rgb(255, 0, 0);
      }
    `),
    ).toEqual({
      test: {
        color: "rgb(255, 0, 0)",
      },
    });
  });

  it("transforms rgba colors", () => {
    expect(
      transform(`
      .test {
        color: rgba(255, 0, 0, 0);
      }
    `),
    ).toEqual({
      test: {
        color: "rgba(255, 0, 0, 0)",
      },
    });
  });
});

describe("transform", () => {
  it("transforms a single transform value with number", () => {
    expect(
      transform(`
      .test {
        transform: scaleX(5);
      }
    `),
    ).toEqual({
      test: { transform: [{ scaleX: 5 }] },
    });
  });

  it("transforms a single transform value with string", () => {
    expect(
      transform(`
      .test {
        transform: rotate(5deg);
      }
    `),
    ).toEqual({
      test: { transform: [{ rotate: "5deg" }] },
    });
  });

  it("transforms multiple transform values", () => {
    expect(
      transform(`
      .test {
        transform: scaleX(5) skewX(1deg);
      }
    `),
    ).toEqual({
      test: { transform: [{ skewX: "1deg" }, { scaleX: 5 }] },
    });
  });

  it("transforms scale(number, number) to scaleX and scaleY", () => {
    expect(
      transform(`
      .test {
        transform: scale(2, 3);
      }
    `),
    ).toEqual({
      test: { transform: [{ scaleY: 3 }, { scaleX: 2 }] },
    });
  });

  it("transforms translate(length, length) to translateX and translateY", () => {
    expect(
      transform(`
      .test {
        transform: translate(2px, 3px);
      }
    `),
    ).toEqual({
      test: { transform: [{ translateY: 3 }, { translateX: 2 }] },
    });
  });

  it("transforms translate(length) to translateX and translateY", () => {
    expect(
      transform(`
      .test {
        transform: translate(5px);
      }
    `),
    ).toEqual({
      test: { transform: [{ translateY: 0 }, { translateX: 5 }] },
    });
  });

  it("transforms skew(angle, angle) to skewX and skewY", () => {
    expect(
      transform(`
      .test {
        transform: skew(2deg, 3deg);
      }
    `),
    ).toEqual({
      test: { transform: [{ skewY: "3deg" }, { skewX: "2deg" }] },
    });
  });

  it("transforms skew(angle) to skewX and skewY", () => {
    expect(
      transform(`
      .test {
        transform: skew(5deg);
      }
    `),
    ).toEqual({
      test: { transform: [{ skewY: "0deg" }, { skewX: "5deg" }] },
    });
  });
});

describe("border", () => {
  it("transforms border shorthand", () => {
    expect(
      transform(`
      .test {
        border: 2px dashed #f00;
      }
    `),
    ).toEqual({
      test: { borderWidth: 2, borderColor: "#f00", borderStyle: "dashed" },
    });
  });

  it("transforms border shorthand in other order", () => {
    expect(
      transform(`
      .test {
        border: #f00 2px dashed;
      }
    `),
    ).toEqual({
      test: { borderWidth: 2, borderColor: "#f00", borderStyle: "dashed" },
    });
  });

  it("transforms border shorthand missing color", () => {
    expect(
      transform(`
      .test {
        border: 2px dashed;
      }
    `),
    ).toEqual({
      test: { borderWidth: 2, borderColor: "black", borderStyle: "dashed" },
    });
  });

  it("transforms border shorthand missing style", () => {
    expect(
      transform(`
      .test {
        border: 2px #f00;
      }
    `),
    ).toEqual({
      test: { borderWidth: 2, borderColor: "#f00", borderStyle: "solid" },
    });
  });

  it("transforms border shorthand missing width", () => {
    expect(
      transform(`
      .test {
        border: #f00 dashed;
      }
    `),
    ).toEqual({
      test: { borderWidth: 1, borderColor: "#f00", borderStyle: "dashed" },
    });
  });

  it("transforms border shorthand missing color & width", () => {
    expect(
      transform(`
      .test {
        border: dashed;
      }
    `),
    ).toEqual({
      test: { borderWidth: 1, borderColor: "black", borderStyle: "dashed" },
    });
  });

  it("transforms border shorthand missing style & width", () => {
    expect(
      transform(`
      .test {
        border: #f00;
      }
    `),
    ).toEqual({
      test: { borderWidth: 1, borderColor: "#f00", borderStyle: "solid" },
    });
  });

  it("transforms border shorthand missing color & style", () => {
    expect(
      transform(`
      .test {
        border: 2px;
      }
    `),
    ).toEqual({
      test: { borderWidth: 2, borderColor: "black", borderStyle: "solid" },
    });
  });

  describe("shorthand border properties related to Image elements", () => {
    it("transforms border-radius", () => {
      expect(
        transform(`
        .test {
          border-radius: 6px;
        }
      `),
      ).toEqual({
        test: { borderRadius: 6 },
      });
    });

    it("transforms border-radius with multiple values", () => {
      expect(
        transform(`
        .test {
          border-radius: 10px 5%;
        }
      `),
      ).toEqual({
        test: {
          borderBottomLeftRadius: "5%",
          borderBottomRightRadius: 10,
          borderTopLeftRadius: 10,
          borderTopRightRadius: "5%",
        },
      });
      expect(
        transform(`
        .test {
          border-radius: 2px 4px 2px;
        }
      `),
      ).toEqual({
        test: {
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 2,
          borderTopLeftRadius: 2,
          borderTopRightRadius: 4,
        },
      });
      expect(
        transform(`
        .test {
          border-radius: 1px 0 3px 4px;
        }
      `),
      ).toEqual({
        test: {
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 3,
          borderTopLeftRadius: 1,
          borderTopRightRadius: 0,
        },
      });
    });

    it("transforms border-color", () => {
      expect(
        transform(`
        .test {
          border-color: #fff;
        }
      `),
      ).toEqual({
        test: { borderColor: "#fff" },
      });
    });

    it("transforms border-color with multiple values", () => {
      expect(
        transform(`
        .test {
          border-color: red #f015ca;
        }
      `),
      ).toEqual({
        test: {
          borderTopColor: "red",
          borderRightColor: "#f015ca",
          borderBottomColor: "red",
          borderLeftColor: "#f015ca",
        },
      });
      expect(
        transform(`
        .test {
          border-color: red yellow green;
        }
      `),
      ).toEqual({
        test: {
          borderTopColor: "red",
          borderRightColor: "yellow",
          borderBottomColor: "green",
          borderLeftColor: "yellow",
        },
      });
      expect(
        transform(`
        .test {
          border-color: red yellow green blue;
        }
      `),
      ).toEqual({
        test: {
          borderTopColor: "red",
          borderRightColor: "yellow",
          borderBottomColor: "green",
          borderLeftColor: "blue",
        },
      });
    });

    it("transforms border-width", () => {
      expect(
        transform(`
        .test {
          border-width: 4px;
        }
      `),
      ).toEqual({
        test: { borderWidth: 4 },
      });
    });

    it("transforms border-width with multiple values", () => {
      expect(
        transform(`
        .test {
          border-width: 2px 1.5rem;
        }
      `),
      ).toEqual({
        test: {
          borderTopWidth: 2,
          borderRightWidth: 24,
          borderBottomWidth: 2,
          borderLeftWidth: 24,
        },
      });
      expect(
        transform(`
        .test {
          border-width: 1px 2rem 1.5rem;
        }
      `),
      ).toEqual({
        test: {
          borderTopWidth: 1,
          borderRightWidth: 32,
          borderBottomWidth: 24,
          borderLeftWidth: 32,
        },
      });
      expect(
        transform(`
        .test {
          border-width: 1px 2rem 0 4rem;
        }
      `),
      ).toEqual({
        test: {
          borderTopWidth: 1,
          borderRightWidth: 32,
          borderBottomWidth: 0,
          borderLeftWidth: 64,
        },
      });
    });

    it("transforms border-style", () => {
      expect(
        transform(`
        .test {
          border-style: solid;
        }
      `),
      ).toEqual({
        test: { borderStyle: "solid" },
      });
    });
  });
});

describe("font", () => {
  it("transforms font weights as strings", () => {
    expect(
      transform(`
      .test {
        font-weight: 400
      }
    `),
    ).toEqual({
      test: { fontWeight: "400" },
    });
  });

  it("transforms font variant as an array", () => {
    expect(
      transform(`
      .test {
        font-variant: tabular-nums;
      }
    `),
    ).toEqual({
      test: { fontVariant: ["tabular-nums"] },
    });
  });
});

describe("background", () => {
  it("transforms background to backgroundColor", () => {
    expect(
      transform(`
      .test {
        background: #f00;
      }
    `),
    ).toEqual({
      test: {
        backgroundColor: "#f00",
      },
    });
  });

  it("transforms background to backgroundColor with rgb", () => {
    expect(
      transform(`
      .test {
        background: rgb(255, 0, 0);
      }
    `),
    ).toEqual({
      test: {
        backgroundColor: "rgb(255, 0, 0)",
      },
    });
  });

  it("transforms background to backgroundColor with named colour", () => {
    expect(
      transform(`
      .test {
        background: red;
      }
    `),
    ).toEqual({
      test: {
        backgroundColor: "red",
      },
    });
  });
});

describe("margin", () => {
  it("transforms margin shorthands using 4 values", () => {
    expect(
      transform(`
      .test {
        margin: 10px 20px 30px 40px;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 10,
        marginRight: 20,
        marginBottom: 30,
        marginLeft: 40,
      },
    });
  });

  it("transforms margin shorthands using 3 values", () => {
    expect(
      transform(`
      .test {
        margin: 10px 20px 30px;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 10,
        marginRight: 20,
        marginBottom: 30,
        marginLeft: 20,
      },
    });
  });

  it("transforms margin shorthands using 2 values", () => {
    expect(
      transform(`
      .test {
        margin: 10px 20px;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 10,
        marginRight: 20,
        marginBottom: 10,
        marginLeft: 20,
      },
    });
  });

  it("transforms margin shorthands using 1 value", () => {
    expect(
      transform(`
      .test {
        margin: 10px;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        marginLeft: 10,
      },
    });
  });

  it("shorthand with 1 value should override previous values", () => {
    expect(
      transform(`
      .test {
        margin-top: 2px;
        margin: 1px;
      }
    `),
    ).toEqual({
      test: { marginTop: 1, marginRight: 1, marginBottom: 1, marginLeft: 1 },
    });
  });

  it("transforms margin shorthand with auto", () => {
    expect(
      transform(`
      .test {
        margin: auto;
      }
    `),
    ).toEqual({
      test: {
        marginTop: "auto",
        marginRight: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
      },
    });
    expect(
      transform(`
      .test {
        margin: 0 auto;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 0,
        marginRight: "auto",
        marginBottom: 0,
        marginLeft: "auto",
      },
    });
    expect(
      transform(`
      .test {
        margin: auto 0;
      }
    `),
    ).toEqual({
      test: {
        marginTop: "auto",
        marginRight: 0,
        marginBottom: "auto",
        marginLeft: 0,
      },
    });
    expect(
      transform(`
      .test {
        margin: 2px 3px auto;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 2,
        marginRight: 3,
        marginBottom: "auto",
        marginLeft: 3,
      },
    });
    expect(
      transform(`
      .test {
        margin: 10px auto 4px;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 10,
        marginRight: "auto",
        marginBottom: 4,
        marginLeft: "auto",
      },
    });
  });
});

describe("text-decoration", () => {
  it("transforms text-decoration into text-decoration- properties", () => {
    expect(
      transform(`
      .test {
        text-decoration: underline dotted red;
      }
    `),
    ).toEqual({
      test: {
        textDecorationLine: "underline",
        textDecorationStyle: "dotted",
        textDecorationColor: "red",
      },
    });
  });

  it("transforms text-decoration without color", () => {
    expect(
      transform(`
      .test {
        text-decoration: underline dotted;
      }
    `),
    ).toEqual({
      test: {
        textDecorationLine: "underline",
        textDecorationStyle: "dotted",
        textDecorationColor: "black",
      },
    });
  });

  it("transforms text-decoration without style", () => {
    expect(
      transform(`
      .test {
        text-decoration: underline red;
      }
    `),
    ).toEqual({
      test: {
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "red",
      },
    });
  });

  it("transforms text-decoration without style and color", () => {
    expect(
      transform(`
      .test {
        text-decoration: underline;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "black",
      },
    });
  });

  it("transforms text-decoration with two line properties", () => {
    expect(
      transform(`
      .test {
        text-decoration: underline line-through dashed red;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "underline line-through",
        textDecorationStyle: "dashed",
        textDecorationColor: "red",
      },
    });
  });

  it("transforms text-decoration in different order", () => {
    expect(
      transform(`
      .test {
        text-decoration: dashed red underline line-through;
      }
    `),
    ).toEqual({
      test: {
        textDecorationLine: "underline line-through",
        textDecorationStyle: "dashed",
        textDecorationColor: "red",
      },
    });
  });

  it("transforms text-decoration with ine in different order", () => {
    expect(
      transform(`
      .test {
        text-decoration: line-through underline;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "underline line-through",
        textDecorationStyle: "solid",
        textDecorationColor: "black",
      },
    });
  });

  it("transforms text-decoration with none", () => {
    expect(
      transform(`
      .test {
        text-decoration: none;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "none",
        textDecorationStyle: "solid",
        textDecorationColor: "black",
      },
    });
  });

  it("transforms text-decoration with none as part of multiple terms", () => {
    expect(
      transform(`
      .test {
        text-decoration: yellow none;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "none",
        textDecorationStyle: "solid",
        textDecorationColor: "yellow",
      },
    });
  });

  it("transforms text-decoration with none in capitals", () => {
    expect(
      transform(`
      .test {
        text-decoration: yellow NONE;
      }
    `),
    ).toEqual({
      test: {
        textDecorationLine: "none",
        textDecorationStyle: "solid",
        textDecorationColor: "yellow",
      },
    });
  });

  it("transforms text-decoration with style in capitals", () => {
    expect(
      transform(`
      .test {
        text-decoration: yellow UNDERLINE LINE-THROUGH;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "underline line-through",
        textDecorationStyle: "solid",
        textDecorationColor: "yellow",
      },
    });
  });

  it("does not transform text-decoration if multiple colors are used", () => {
    expect(() =>
      transform(`
      .test {
        text-decoration: underline red yellow;
      }
      `),
    ).toThrow(
      'Failed to parse declaration "textDecoration: underline red yellow"',
    );
  });
});

describe("text-decoration-line", () => {
  it("transforms text-decoration-line with underline line-through", () => {
    expect(
      transform(`
      .test {
        text-decoration-line: underline line-through;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "underline line-through",
      },
    });
  });

  it("transforms text-decoration-line with line-through underline", () => {
    expect(
      transform(`
      .test {
        text-decoration-line: line-through underline;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "underline line-through",
      },
    });
  });

  it("transforms text-decoration-line with none", () => {
    expect(
      transform(`
      .test {
        text-decoration-line: none;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "none",
      },
    });
  });
});

describe("flex-box", () => {
  it("transforms flex shorthand with 3 values", () => {
    expect(
      transform(`
      .test {
        flex: 1 2 3px;
      }
    `),
    ).toEqual({
      test: { flexGrow: 1, flexShrink: 2, flexBasis: 3 },
    });
  });

  it("transforms flex shorthand with 3 values in reverse order", () => {
    expect(
      transform(`
      .test {
        flex: 3px 1 2;
      }
    `),
    ).toEqual({
      test: { flexGrow: 1, flexShrink: 2, flexBasis: 3 },
    });
  });

  it("transforms flex shorthand with 2 values of flex-grow and flex-shrink", () => {
    expect(
      transform(`
      .test {
        flex: 1 2;
      }
    `),
    ).toEqual({
      test: { flexGrow: 1, flexShrink: 2, flexBasis: 0 },
    });
  });

  it("transforms flex shorthand with 2 values of flex-grow and flex-basis", () => {
    expect(
      transform(`
      .test {
        flex: 2 2px;
      }
    `),
    ).toEqual({
      test: { flexGrow: 2, flexShrink: 1, flexBasis: 2 },
    });
  });

  it("transforms flex shorthand with 2 values of flex-grow and flex-basis (reversed)", () => {
    expect(
      transform(`
      .test {
        flex: 2px 2;
      }
    `),
    ).toEqual({
      test: { flexGrow: 2, flexShrink: 1, flexBasis: 2 },
    });
  });

  it("transforms flex shorthand with 1 value of flex-grow", () => {
    expect(
      transform(`
      .test {
        flex: 2;
      }
    `),
    ).toEqual({
      test: { flexGrow: 2, flexShrink: 1, flexBasis: 0 },
    });
  });

  it("transforms flex shorthand with 1 value of flex-basis", () => {
    expect(
      transform(`
      .test {
        flex: 10px;
      }
    `),
    ).toEqual({
      test: { flexGrow: 1, flexShrink: 1, flexBasis: 10 },
    });
  });

  /*
    A unitless zero that is not already preceded by two flex factors must be interpreted as a flex
    factor. To avoid misinterpretation or invalid declarations, authors must specify a zero
    <‘flex-basis’> component with a unit or precede it by two flex factors.
  */
  it("transforms flex shorthand with flex-grow/shrink taking priority over basis", () => {
    expect(
      transform(`
      .test {
        flex: 0 1 0;
      }
    `),
    ).toEqual({
      test: { flexGrow: 0, flexShrink: 1, flexBasis: 0 },
    });
  });

  it("transforms flex shorthand with flex-basis set to auto", () => {
    expect(
      transform(`
      .test {
        flex: 0 1 auto;
      }
    `),
    ).toEqual({
      test: { flexGrow: 0, flexShrink: 1 },
    });
  });

  it("transforms flex shorthand with flex-basis set to auto appearing first", () => {
    expect(
      transform(`
      .test {
        flex: auto 0 1;
      }
    `),
    ).toEqual({
      test: { flexGrow: 0, flexShrink: 1 },
    });
  });

  it("transforms flex auto keyword", () => {
    expect(
      transform(`
      .test {
        flex: auto;
      }
    `),
    ).toEqual({
      test: { flexGrow: 1, flexShrink: 1 },
    });
  });

  it("transforms flex none keyword", () => {
    expect(
      transform(`
      .test {
        flex: none;
      }
    `),
    ).toEqual({
      test: { flexGrow: 0, flexShrink: 0 },
    });
  });

  it("transforms flexFlow shorthand with two values", () => {
    expect(
      transform(`
      .test {
        flex-flow: column wrap;
      }
    `),
    ).toEqual({
      test: { flexDirection: "column", flexWrap: "wrap" },
    });
  });

  it("transforms flexFlow shorthand missing flexDirection", () => {
    expect(
      transform(`
      .test {
        flex-flow: wrap;
      }
    `),
    ).toEqual({
      test: { flexDirection: "row", flexWrap: "wrap" },
    });
  });

  it("transforms flexFlow shorthand missing flexWrap", () => {
    expect(
      transform(`
      .test {
        flex-flow: column;
      }
    `),
    ).toEqual({
      test: { flexDirection: "column", flexWrap: "nowrap" },
    });
  });

  it("does not transform invalid flex'", () => {
    expect(() => {
      transform(`
      .test {
        flex: 1 2px 3;
      }
    `);
    }).toThrowError('Failed to parse declaration "flex: 1 2px 3"');
  });
});

describe("font", () => {
  it("transforms font", () => {
    expect(
      transform(`
      .test {
        font: bold italic small-caps 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "italic",
        fontVariant: ["small-caps"],
        lineHeight: 18,
      },
    });
  });

  it("transforms font missing font-variant", () => {
    expect(
      transform(`
      .test {
        font: bold italic 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "italic",
        fontVariant: [],
        lineHeight: 18,
      },
    });
  });

  it("transforms font missing font-style", () => {
    expect(
      transform(`
      .test {
        font: bold small-caps 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "normal",
        fontVariant: ["small-caps"],
        lineHeight: 18,
      },
    });
  });

  it("transforms font missing font-weight", () => {
    expect(
      transform(`
      .test {
        font: italic small-caps 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "italic",
        fontVariant: ["small-caps"],
        lineHeight: 18,
      },
    });
  });

  it("transforms font with font-weight normal", () => {
    expect(
      transform(`
      .test {
        font: normal 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        fontVariant: [],
        lineHeight: 18,
      },
    });
  });

  it("transforms font with font-weight and font-style normal", () => {
    expect(
      transform(`
      .test {
        font: normal normal 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        fontVariant: [],
        lineHeight: 18,
      },
    });
  });

  it("transforms font with no font-weight, font-style, and font-variant", () => {
    expect(
      transform(`
      .test {
        font: 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        fontVariant: [],
        lineHeight: 18,
      },
    });
  });

  it("omits line height if not specified", () => {
    expect(
      transform(`
      .test {
        font: 16px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        fontVariant: [],
      },
    });
  });

  it("allows line height as multiple", () => {
    expect(
      transform(`
      .test {
        font: 16px/1.5 "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        fontVariant: [],
        lineHeight: 24,
      },
    });
  });

  it("transforms font without quotes", () => {
    expect(
      transform(`
      .test {
        font: bold italic small-caps 16px/18px Helvetica Neue;
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica Neue",
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "italic",
        fontVariant: ["small-caps"],
        lineHeight: 18,
      },
    });
  });

  it("transforms font-family with double quotes", () => {
    expect(
      transform(`
      .test {
        font-family: "Helvetica Neue";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica Neue",
      },
    });
  });

  it("transforms font-family with single quotes", () => {
    expect(
      transform(`
      .test {
        font-family: 'Helvetica Neue';
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica Neue",
      },
    });
  });

  it("transforms font-family without quotes", () => {
    expect(
      transform(`
      .test {
        font-family: Helvetica Neue;
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica Neue",
      },
    });
  });

  it("transforms font-family with quotes with otherwise invalid values", () => {
    expect(
      transform(`
      .test {
        font-family: "Goudy Bookletter 1911";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Goudy Bookletter 1911",
      },
    });
  });

  it("transforms font-family with quotes with escaped values", () => {
    expect(
      transform(`
      .test {
        font-family: "test\\A test";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "test\ntest",
      },
    });
  });

  it("transforms font-family with quotes with escaped quote", () => {
    expect(
      transform(`
      .test {
        font-family: "test\\"test";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: 'test"test',
      },
    });
  });

  it("does not transform invalid unquoted font-family", () => {
    expect(() => {
      transform(`
      .test {
        font-family: Goudy Bookletter 1911;
      }
    `);
    }).toThrowError(
      'Failed to parse declaration "fontFamily: Goudy Bookletter 1911"',
    );
  });
});

describe("box-shadow", () => {
  it("transforms box-shadow into shadow- properties", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px red;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "red",
        shadowOpacity: 1,
      },
    });
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px #f00;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "#f00",
        shadowOpacity: 1,
      },
    });
  });

  it("supports rgb values", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px rgb(100, 100, 100);
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "rgb(100, 100, 100)",
        shadowOpacity: 1,
      },
    });
  });

  it("supports rgba values", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px rgba(100, 100, 100, 0.5);
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "rgba(100, 100, 100, 0.5)",
        shadowOpacity: 1,
      },
    });
  });

  it("supports box-shadow with hsl color", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px hsl(120, 100%, 50%);
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "hsl(120, 100%, 50%)",
        shadowOpacity: 1,
      },
    });
  });

  it("supports box-shadow with hsla color", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px hsla(120, 100%, 50%, 0.7);
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "hsla(120, 100%, 50%, 0.7)",
        shadowOpacity: 1,
      },
    });
  });

  it("trims values", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px   20px   30px   #f00 ;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "#f00",
        shadowOpacity: 1,
      },
    });
  });

  it("transforms box-shadow with 0 values", () => {
    expect(
      transform(`
      .test {
        box-shadow: 0 0 1px red;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 1,
        shadowColor: "red",
        shadowOpacity: 1,
      },
    });
    expect(
      transform(`
      .test {
        box-shadow: 0 0 0 red;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
        shadowColor: "red",
        shadowOpacity: 1,
      },
    });
    expect(
      transform(`
      .test {
        box-shadow: 1px 1px 0 #00f;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 0,
        shadowColor: "#00f",
        shadowOpacity: 1,
      },
    });
  });

  it("transforms box-shadow without blur-radius", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px red;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 0,
        shadowColor: "red",
        shadowOpacity: 1,
      },
    });
  });

  it("transforms box-shadow without color", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "black",
        shadowOpacity: 1,
      },
    });
  });

  it("transforms box-shadow without blur-radius, color", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 0,
        shadowColor: "black",
        shadowOpacity: 1,
      },
    });
  });

  it("transforms box-shadow enforces offset to be present", () => {
    expect(() => {
      transform(`
      .test {
        box-shadow: red;
      }
    `);
    }).toThrowError('Failed to parse declaration "boxShadow: red"');
  });

  it("transforms box-shadow and throws if multiple colors are used", () => {
    expect(() => {
      transform(`
      .test {
        box-shadow: 0 0 0 red yellow green blue;
      }
    `);
    }).toThrowError(
      'Failed to parse declaration "boxShadow: 0 0 0 red yellow green blue"',
    );
  });

  it("transforms box-shadow and enforces offset-y if offset-x present", () => {
    expect(() => {
      transform(`
      .test {
        box-shadow: 10px;
      }
    `);
    }).toThrowError('Failed to parse declaration "boxShadow: 10px"');
  });

  it("transforms box-shadow and enforces units for non 0 values", () => {
    expect(() => {
      transform(`
      .test {
        box-shadow: 10 20px 30px #f00;
      }
    `);
    }).toThrowError(
      'Failed to parse declaration "boxShadow: 10 20px 30px #f00"',
    );
    expect(() => {
      transform(`
      .test {
        box-shadow: 10px 20;
      }
    `);
    }).toThrowError('Failed to parse declaration "boxShadow: 10px 20"');
    expect(() => {
      transform(`
      .test {
        box-shadow: 20;
      }
    `);
    }).toThrowError('Failed to parse declaration "boxShadow: 20"');
  });
});

describe("text-shadow", () => {
  it("textShadow with all values", () => {
    expect(
      transform(`
      .test {
        text-shadow: 10px 20px 30px red;
      }
    `),
    ).toEqual({
      test: {
        textShadowOffset: { width: 10, height: 20 },
        textShadowRadius: 30,
        textShadowColor: "red",
      },
    });
  });

  it("textShadow omitting blur", () => {
    expect(
      transform(`
      .test {
        text-shadow: 10px 20px red;
      }
    `),
    ).toEqual({
      test: {
        textShadowOffset: { width: 10, height: 20 },
        textShadowRadius: 0,
        textShadowColor: "red",
      },
    });
  });

  it("textShadow omitting color", () => {
    expect(
      transform(`
      .test {
        text-shadow: 10px 20px;
      }
    `),
    ).toEqual({
      test: {
        textShadowOffset: { width: 10, height: 20 },
        textShadowRadius: 0,
        textShadowColor: "black",
      },
    });
  });

  it("textShadow enforces offset-x and offset-y", () => {
    expect(() =>
      transform(`
      .test {
        text-shadow: red;
      }
      `),
    ).toThrow('Failed to parse declaration "textShadow: red"');
    expect(() =>
      transform(`
      .test {
        text-shadow: 10px red;
      }
      `),
    ).toThrow('Failed to parse declaration "textShadow: 10px red"');
  });
});

describe("rem unit", () => {
  it("should transform a single rem value", () => {
    expect(
      transform(`
      .test1 {
        padding: 2rem;
      }
      .test2 {
        font-size: 1rem;
      }
    `),
    ).toEqual({
      test1: {
        paddingBottom: 32,
        paddingLeft: 32,
        paddingRight: 32,
        paddingTop: 32,
      },
      test2: {
        fontSize: 16,
      },
    });
  });

  it("should transform multiple rem values", () => {
    expect(
      transform(`
      .test1 {
        transform: translate(1rem, 2rem);
      }
      .test2 {
        box-shadow: 1rem 2rem 3rem #fff;
      }
    `),
    ).toEqual({
      test1: {
        transform: [{ translateY: 32 }, { translateX: 16 }],
      },
      test2: {
        shadowColor: "#fff",
        shadowOffset: { height: 32, width: 16 },
        shadowRadius: 48,
        shadowOpacity: 1,
      },
    });
  });

  it("should support decimal values", () => {
    expect(
      transform(`
      .test1 {
        transform: translate(0.9375rem, 1.625rem);
      }
      .test2 {
        border-radius: 0.5625rem;
      }
    `),
    ).toEqual({
      test1: { transform: [{ translateY: 26 }, { translateX: 15 }] },
      test2: {
        borderRadius: 9,
      },
    });

    expect(
      transform(`
      .test1 {
        transform: translate(.9375rem, 1.625rem);
      }
      .test2 {
        border-radius: .5625rem;
      }
    `),
    ).toEqual({
      test1: { transform: [{ translateY: 26 }, { translateX: 15 }] },
      test2: {
        borderRadius: 9,
      },
    });
  });
});

describe("media queries", () => {
  it("transforms media queries", () => {
    expect(
      transform(
        `
        .container {
          background-color: #f00;
        }

        @media (orientation: landscape) {
          .container {
            background-color: #00f;
          }
        }
        `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toEqual({
      container: {
        backgroundColor: "#f00",
      },
      "@media (orientation: landscape)": {
        container: {
          backgroundColor: "#00f",
        },
      },
    });
  });

  it("merges media queries", () => {
    expect(
      transform(
        `
        .container {
          background-color: #f00;
        }
        .box {
          background-color: #f00;
        }

        @media (orientation: landscape) {
          .container {
            background-color: #00f;
          }
        }
        @media (orientation: landscape) {
          .box {
            background-color: #00f;
          }
        }
        `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toEqual({
      container: {
        backgroundColor: "#f00",
      },
      box: {
        backgroundColor: "#f00",
      },
      "@media (orientation: landscape)": {
        container: {
          backgroundColor: "#00f",
        },
        box: {
          backgroundColor: "#00f",
        },
      },
    });
  });

  it("does not transform media queries without option enabled", () => {
    expect(
      transform(`
      .container {
        background-color: #f00;
      }

      @media (orientation: landscape) {
        .container {
          background-color: #00f;
        }
      }
  `),
    ).toEqual({
      container: {
        backgroundColor: "#f00",
      },
    });
  });

  expect(
    transform(
      `
      .container {
        background-color: #f00;
      }

      @media (orientation: landscape) {
        .container {
          background-color: #00f;
        }
      }
      `,
      {
        parseMediaQueries: false,
      },
    ),
  ).toEqual({
    container: {
      backgroundColor: "#f00",
    },
  });
});
