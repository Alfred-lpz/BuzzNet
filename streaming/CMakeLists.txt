
set(OpenCV_DIR "C:/OpenCV/opencv/build")

cmake_minimum_required(VERSION 2.8)

project(StreamingUDPVideo)

find_package(OpenCV REQUIRED)

include_directories(${OpenCV_INCLUDE_DIRS})
include_directories(${EIGEN_INCLUDE_DIR})
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/src)

# Default to Release mode.
IF(NOT DEFINED CMAKE_BUILD_TYPE)
  SET(${CMAKE_BUILD_TYPE} Release ... FORCE)
ENDIF()

# Release mode makes the code run faster.
IF(NOT ${CMAKE_BUILD_TYPE} MATCHES Debug)
  MESSAGE("Build type: Release.")
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -m64 -Ofast")
ELSE()
  MESSAGE("WARNING: Building in DEBUG MODE! Use 'cmake -DCMAKE_BUILD_TYPE=Release' for faster runtime.")
ENDIF()

# Require C++ 11.
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

# Libraries will be stored in the "lib" directory, and binaries in "bin".
SET(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
SET(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
SET(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

# Grab all binary source files in the src directory.
file(GLOB SRC "${CMAKE_CURRENT_SOURCE_DIR}/src/*")


# Create a library for all of the added Super Resolution dependencies (i.e. all
# the classes).
file(GLOB   protocols_SRC   "src/protocols/*.cpp")
file(GLOB   receiver_SRC    "src/receiver/*.cpp")
file(GLOB   sender_SRC      "src/sender/*.cpp")
file(GLOB   util_SRC        "src/util/*.cpp")
file(GLOB   video_SRC       "src/video/*.cpp")

# Add the Receiver binary.
add_executable(
  Receiver
  src/receiver.cpp
  ${protocols_SRC}
  ${receiver_SRC}
  ${util_SRC}
  ${video_SRC}
)
target_link_libraries(
  Receiver
  ${OpenCV_LIBS}
)

# Add the Sender binary.
add_executable(
  Sender
  src/sender.cpp
  ${protocols_SRC}
  ${sender_SRC}
  ${util_SRC}
  ${video_SRC}
)
target_link_libraries(
  Sender
  ${OpenCV_LIBS}
)
